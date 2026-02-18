import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClimateService } from './climate.service';
import { ClimateController } from './climate.controller';
import { ClimateData } from './entities/climate-data.entity';

@Module({
  imports:     [TypeOrmModule.forFeature([ClimateData])],
  controllers: [ClimateController],
  providers:   [ClimateService],
  exports:     [ClimateService],
})
export class ClimateModule {}
