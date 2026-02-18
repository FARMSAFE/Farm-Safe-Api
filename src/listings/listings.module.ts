import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { Listing } from './entities/listing.entity';
import { CropsModule } from '../crops/crops.module';

@Module({
  imports:     [TypeOrmModule.forFeature([Listing]), CropsModule],
  controllers: [ListingsController],
  providers:   [ListingsService],
  exports:     [ListingsService, TypeOrmModule],
})
export class ListingsModule {}
