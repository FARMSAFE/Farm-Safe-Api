// src/auth/strategies/session.serializer.ts
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, user: any) => void): any {
    // Store only user ID in session
    done(null, { id: user.id });
  }

  async deserializeUser(payload: any, done: (err: Error | null, user: any) => void): Promise<any> {
    // Retrieve full user from database using ID from session
    const user = await this.authService.findUserById(payload.id);
    
    if (!user) {
      return done(null, null);
    }
    
    done(null, user);
  }
}