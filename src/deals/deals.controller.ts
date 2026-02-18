import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, UseGuards, Request,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStatusDto } from './dto/update-deal-status.dto';
import { AuthenticatedGuard } from '../shared/auth.guard';

@Controller('deals')
@UseGuards(AuthenticatedGuard)
export class DealsController {
  constructor(private readonly svc: DealsService) {}

  @Get()      findAll()                        { return this.svc.findAll(); }
  @Get('mine') findMine(@Request() req: any)   { return this.svc.findByUser(req.user.userId); }
  @Get(':id')  findOne(@Param('id') id: string){ return this.svc.findOne(id); }

  @Post()
  create(@Body() dto: CreateDealDto) { return this.svc.create(dto); }

  @Patch(':id/status')
  updateStatus(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateDealStatusDto) {
    return this.svc.updateStatus(id, dto.status, req.user.userId);
  }
}
