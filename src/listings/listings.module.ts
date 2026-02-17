import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { Listing } from './entities/listing.entity';
// Import CropsModule to access Crop entity
import { CropsModule } from '../crops/crops.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Listing]),
    CropsModule, // Import CropsModule for Crop entity relation
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [ListingsService, TypeOrmModule], // Export for other modules
})
export class ListingsModule {}
