import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthenticatedGuard } from '../shared/auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Get('market-trends') getMarketTrends()     { return this.svc.getMarketTrends(); }
  @Get('districts')     getDistrictAnalytics() { return this.svc.getDistrictAnalytics(); }

  @Get('dashboard')
  @UseGuards(AuthenticatedGuard)
  getDashboard() { return this.svc.getDashboardStats(); }

  @Get('my-activity')
  @UseGuards(AuthenticatedGuard)
  getMyActivity(@Request() req: any) { return this.svc.getUserActivity(req.user.userId); }
}
