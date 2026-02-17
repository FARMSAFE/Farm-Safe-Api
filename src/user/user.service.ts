// src/user/user.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: any): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create(createUserDto);
    
    // Option 1: Use insert instead of save
    const result = await this.userRepository.insert(user);
    const savedUser = await this.userRepository.findOne({ 
      where: { id: result.identifiers[0].id } 
    });
    
    if (!savedUser) {
      throw new Error('Failed to retrieve saved user');
    }
    
    return savedUser;
  }



  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    
    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'status', 'isEmailVerified', 'isPhoneVerified', 'firstName', 'lastName']
    });
    
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.findOne(id);
    return updatedUser;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return { message: `User with ID ${id} successfully deleted` };
  }

  async verifyEmail(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isEmailVerified = true;
    
    if (user.isPhoneVerified) {
      user.status = UserStatus.ACTIVE;
    } else {
      user.status = UserStatus.PENDING_VERIFICATION;
    }
    
    const updatedUser = await this.userRepository.save(user);
    return updatedUser as User;
  }

  async verifyPhone(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isPhoneVerified = true;
    
    if (user.isEmailVerified) {
      user.status = UserStatus.ACTIVE;
    } else {
      user.status = UserStatus.PENDING_VERIFICATION;
    }
    
    const updatedUser = await this.userRepository.save(user);
    return updatedUser as User;
  }

  async updateProfilePicture(id: string, profilePictureUrl: string): Promise<User> {
    await this.userRepository.update(id, { profilePicture: profilePictureUrl });
    return await this.findOne(id);
  }

  async updatePreferredCrops(id: string, preferredCrops: string[]): Promise<User> {
    await this.userRepository.update(id, { preferredCrops });
    return await this.findOne(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }
}