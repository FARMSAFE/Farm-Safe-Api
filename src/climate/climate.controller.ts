import {
  Controller, Get, Post, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ClimateService } from './climate.service';
import { CreateClimateDto } from './dto/create-climate.dto';
import { AuthenticatedGuard, RolesGuard, Roles } from '../shared/auth.guard';
import { UserRole } from '../shared/user.interface';

@Controller('climate')
export class ClimateController {
  constructor(private readonly svc: ClimateService) {}

  @Get('districts')  getAllDistricts()                           { return this.svc.getAllDistricts(); }
  @Get(':district/latest') findLatest(@Param('district') d: string) { return this.svc.findLatest(d); }
  @Get(':district')  findByDistrict(@Param('district') d: string, @Query('days') days?: number) {
    return this.svc.findByDistrict(d, days ? +days : 7);
  }

  @Post()
  @UseGuards(AuthenticatedGuard, RolesGuard) @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateClimateDto) { return this.svc.create(dto); }
}
