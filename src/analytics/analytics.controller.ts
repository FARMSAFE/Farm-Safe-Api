import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  // TODO: Add @UseGuards(JwtAuthGuard) when auth module is ready
  getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('market-trends')
  getMarketTrends() {
    return this.analyticsService.getMarketTrends();
  }

  @Get('districts')
  getDistrictAnalytics() {
    return this.analyticsService.getDistrictAnalytics();
  }

  @Get('user/:userId/activity')
  // TODO: This will become 'my-activity' when auth is integrated
  getUserActivity(@Param('userId') userId: string) {
    return this.analyticsService.getUserActivity(userId);
  }
}
