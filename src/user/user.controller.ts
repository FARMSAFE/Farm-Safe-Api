// src/user/user.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';

@Controller('users')
@Serialize(UserResponseDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/verify-email')
  verifyEmail(@Param('id') id: string) {
    return this.userService.verifyEmail(id);
  }

  @Post(':id/verify-phone')
  verifyPhone(@Param('id') id: string) {
    return this.userService.verifyPhone(id);
  }

  @Post(':id/profile-picture')
  updateProfilePicture(
    @Param('id') id: string,
    @Body('profilePicture') profilePicture: string,
  ) {
    return this.userService.updateProfilePicture(id, profilePicture);
  }

  @Patch(':id/preferred-crops')
  updatePreferredCrops(
    @Param('id') id: string,
    @Body('preferredCrops') preferredCrops: string[],
  ) {
    return this.userService.updatePreferredCrops(id, preferredCrops);
  }
}