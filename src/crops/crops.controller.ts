import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  // TODO: Add @UseGuards(JwtAuthGuard, RolesGuard) when auth module is ready
  // TODO: Add @Roles(UserRole.ADMIN) when auth module is ready
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropsService.create(createCropDto);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.cropsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cropsService.findOne(id);
  }

  @Patch(':id')
  // TODO: Add @UseGuards(JwtAuthGuard, RolesGuard) when auth module is ready
  // TODO: Add @Roles(UserRole.ADMIN) when auth module is ready
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropsService.update(id, updateCropDto);
  }

  @Delete(':id')
  // TODO: Add @UseGuards(JwtAuthGuard, RolesGuard) when auth module is ready
  // TODO: Add @Roles(UserRole.ADMIN) when auth module is ready
  remove(@Param('id') id: string) {
    return this.cropsService.remove(id);
  }
}
