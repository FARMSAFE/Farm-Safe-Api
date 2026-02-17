import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check if user is authenticated via session
    if (request.isAuthenticated()) {
      return true;
    }
    
    throw new UnauthorizedException('You must be logged in to access this resource');
  }
}