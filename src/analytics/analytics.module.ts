import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ListingsModule } from '../listings/listings.module';
import { ProcurementModule } from '../procurement/procurement.module';
import { DealsModule } from '../deals/deals.module';

@Module({
  imports:     [ListingsModule, ProcurementModule, DealsModule],
  controllers: [AnalyticsController],
  providers:   [AnalyticsService],
})
export class AnalyticsModule {}
