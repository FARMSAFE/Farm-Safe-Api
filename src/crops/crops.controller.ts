import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
// STUB guards – swap for real ones when Auth module is merged
import { AuthenticatedGuard, RolesGuard, Roles } from '../shared/auth.guard';
import { UserRole } from '../shared/user.interface';

@Controller('crops')
export class CropsController {
  constructor(private readonly svc: CropsService) {}

  /** Public – anyone can browse the crop catalogue */
  @Get()
  findAll(@Query('category') category?: string) {
    return this.svc.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  /** Admin-only write operations */
  @Post()
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateCropDto) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCropDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
