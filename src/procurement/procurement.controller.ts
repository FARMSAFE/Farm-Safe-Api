import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, Query, UseGuards, Request,
} from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { UpdateProcurementDto } from './dto/update-procurement.dto';
import { AuthenticatedGuard, RolesGuard, Roles } from '../shared/auth.guard';
import { UserRole } from '../shared/user.interface';

@Controller('procurement')
export class ProcurementController {
  constructor(private readonly svc: ProcurementService) {}

  @Get()
  findAll(@Query() filters: any) { return this.svc.findAll(filters); }

  @Get('buyer/mine')
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.BUYER)
  findMine(@Request() req: any) { return this.svc.findByBuyer(req.user.userId); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.BUYER)
  create(@Request() req: any, @Body() dto: CreateProcurementDto) {
    return this.svc.create(req.user.userId, dto);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.BUYER)
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateProcurementDto) {
    return this.svc.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.BUYER)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.svc.remove(id, req.user.userId);
  }
}
