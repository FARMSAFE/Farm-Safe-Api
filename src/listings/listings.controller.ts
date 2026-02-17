import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  // TODO: Add @UseGuards(JwtAuthGuard, RolesGuard) when auth module is ready
  // TODO: Add @Roles(UserRole.FARMER) when auth module is ready
  // For now, farmerId should be passed in body for testing
  create(@Body() body: CreateListingDto & { farmerId: string }) {
    const { farmerId, ...createListingDto } = body;
    return this.listingsService.create(farmerId, createListingDto);
  }

  @Get()
  findAll(@Query() filters: any) {
    return this.listingsService.findAll(filters);
  }

  @Get('farmer/:farmerId')
  // TODO: This will become 'my-listings' when auth is integrated
  findByFarmer(@Param('farmerId') farmerId: string) {
    return this.listingsService.findByFarmer(farmerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  // TODO: Add @UseGuards(JwtAuthGuard, RolesGuard) when auth module is ready
  // For now, farmerId should be passed in body for testing
  update(@Param('id') id: string, @Body() body: UpdateListingDto & { farmerId: string }) {
    const { farmerId, ...updateListingDto } = body;
    return this.listingsService.update(id, farmerId, updateListingDto);
  }

  @Delete(':id')
  // TODO: Add @UseGuards(JwtAuthGuard, RolesGuard) when auth module is ready
  // For now, farmerId should be passed in query for testing
  remove(@Param('id') id: string, @Query('farmerId') farmerId: string) {
    return this.listingsService.remove(id, farmerId);
  }
}
