import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
// Import ListingsModule to access Listing entity
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [
    ListingsModule, // Import to access Listing entity
    // TODO: Add other modules when ready
    // ProcurementModule,
    // DealsModule,
    // UsersModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
