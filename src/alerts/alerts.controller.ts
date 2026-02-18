import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, Query, UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AuthenticatedGuard, RolesGuard, Roles } from '../shared/auth.guard';
import { UserRole } from '../shared/user.interface';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly svc: AlertsService) {}

  @Get() findAll(@Query('district') d?: string) { return this.svc.findAll(d); }
  @Get(':id') findOne(@Param('id') id: string)  { return this.svc.findOne(id); }

  @Post()
  @UseGuards(AuthenticatedGuard, RolesGuard) @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateAlertDto) { return this.svc.create(dto); }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard, RolesGuard) @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: Partial<CreateAlertDto>) { return this.svc.update(id, dto); }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard, RolesGuard) @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
