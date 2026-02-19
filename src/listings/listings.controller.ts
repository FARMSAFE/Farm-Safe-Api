import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, Query, UseGuards, Request,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
// STUB guards – swap for real ones when Auth module is merged
import { AuthenticatedGuard, RolesGuard, Roles } from '../shared/auth.guard';
import { UserRole } from '../shared/user.interface';

@Controller('listings')
export class ListingsController {
  constructor(private readonly svc: ListingsService) {}

  /** Public */
  @Get()
  findAll(@Query() filters: any) { return this.svc.findAll(filters); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  /** Authenticated farmer routes */
  @Get('farmer/mine')
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.FARMER)
  findMine(@Request() req: any) {
    return this.svc.findByFarmer(req.user.id);
  }

  @Post()
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.FARMER)
  create(@Request() req: any, @Body() dto: CreateListingDto) {
    return this.svc.create(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.FARMER)
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateListingDto) {
    return this.svc.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(UserRole.FARMER)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.svc.remove(id, req.user.id);
  }
}
