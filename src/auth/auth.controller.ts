
import { Controller, Post, Body, UseGuards, Req, Get, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req) {
    return this.authService.login(req.user, req);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  async logout(@Req() req) {
    await this.authService.logout(req);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('sessions')
  getSessions(@Req() req) {
    return this.authService.getAllSessions(req.user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('sessions/:sessionId')
  async revokeSession(@Param('sessionId') sessionId: string, @Req() req) {
    await this.authService.revokeSession(sessionId, req.user.id);
    return { message: 'Session revoked successfully' };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('sessions')
  async revokeAllSessions(@Req() req) {
    await this.authService.revokeAllSessions(req.user.id, req.sessionID);
    return { message: 'All other sessions revoked successfully' };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // Implement password reset email
    return { message: 'If your email exists in our system, you will receive a password reset link' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // Implement password reset
    return { message: 'Password reset successfully' };
  }

  @Get('check')
  checkAuth(@Req() req) {
    return {
      authenticated: req.isAuthenticated(),
      user: req.user || null
    };
  }
}