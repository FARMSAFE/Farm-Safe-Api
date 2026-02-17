// src/deal/deal.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DealService } from './deal.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { DealResponseDto } from './dto/deal-response.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';

@Controller('deals')
@Serialize(DealResponseDto)
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Post()
  create(@Body() createDealDto: CreateDealDto) {
    return this.dealService.create(createDealDto);
  }

  @Get()
  findAll() {
    return this.dealService.findAll();
  }

  @Get('farmer/:farmerId')
  findByFarmer(@Param('farmerId') farmerId: string) {
    return this.dealService.findByFarmer(farmerId);
  }

  @Get('buyer/:buyerId')
  findByBuyer(@Param('buyerId') buyerId: string) {
    return this.dealService.findByBuyer(buyerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealService.update(id, updateDealDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dealService.remove(id);
  }
}