// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm'; 
import * as bcrypt from 'bcryptjs';
import { User, UserStatus } from '../user/entities/user.entity';
import { Session } from './entities/session.entity';
import { RegisterDto } from './dto/register.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'status', 'firstName', 'lastName', 'isEmailVerified']
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(`Account is ${user.status}. Please verify your email.`);
    }

    const { password: _, ...result } = user;
    return result;
  }

  async register(registerDto: RegisterDto): Promise<any> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    // Create user
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const { password: _, ...result } = savedUser;
    
    return result;
  }

  async login(user: any, req: any): Promise<any> {
    // Log the login in session
    return new Promise((resolve, reject) => {
      req.login(user, async (err) => {
        if (err) {
          reject(err);
        }
        
        // Store session in database
        const sessionId = req.sessionID;
        const session = this.sessionRepository.create({
          sessionId,
          userId: user.id,
          data: req.session,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        });
        
        await this.sessionRepository.save(session);
        
        // Update last login
        await this.userRepository.update(user.id, { lastLoginAt: new Date() });
        
        resolve(user);
      });
    });
  }

  async logout(req: any): Promise<void> {
    // Remove session from database
    if (req.sessionID) {
      await this.sessionRepository.delete({ sessionId: req.sessionID });
    }
    
    // Destroy session
    return new Promise((resolve, reject) => {
      req.logout((err) => {
        if (err) {
          reject(err);
        }
        req.session.destroy((err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    });
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user || null;
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['listings']
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return user;
  }

  async getAllSessions(userId: string): Promise<Session[]> {
    return await this.sessionRepository.find({
      where: { userId, isRevoked: false },
      order: { createdAt: 'DESC' }
    });
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { sessionId, userId }
    });
    
    if (session) {
      session.isRevoked = true;
      await this.sessionRepository.save(session);
    }
  }

  async revokeAllSessions(userId: string, currentSessionId: string): Promise<void> {
    await this.sessionRepository.update(
      { userId, sessionId: Not(currentSessionId) },
      { isRevoked: true }
    );
  }
}