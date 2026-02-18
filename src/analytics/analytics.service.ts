import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../listings/entities/listing.entity';
import { ProcurementRequest } from '../procurement/entities/procurement-request.entity';
import { Deal } from '../deals/entities/deal.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Listing) private listingsRepo: Repository<Listing>,
    @InjectRepository(ProcurementRequest) private procRepo: Repository<ProcurementRequest>,
    @InjectRepository(Deal) private dealsRepo: Repository<Deal>,
  ) {}

  async getDashboardStats() {
    const [totalListings, activeListings] = await Promise.all([
      this.listingsRepo.count(),
      this.listingsRepo.count({ where: { isActive: true } }),
    ]);
    const [totalProc, openProc] = await Promise.all([
      this.procRepo.count(),
      this.procRepo.count({ where: { status: 'open' as any } }),
    ]);
    const [totalDeals, completedDeals] = await Promise.all([
      this.dealsRepo.count(),
      this.dealsRepo.count({ where: { status: 'completed' as any } }),
    ]);
    return {
      listings:    { total: totalListings,  active: activeListings },
      procurement: { total: totalProc,      open: openProc },
      deals:       { total: totalDeals,     completed: completedDeals },
    };
  }

  async getMarketTrends() {
    return this.listingsRepo
      .createQueryBuilder('l')
      .leftJoin('l.crop', 'crop')
      .select('crop.name',          'cropName')
      .addSelect('AVG(l.pricePerUnit)', 'avgPrice')
      .addSelect('SUM(l.quantity)',     'totalQuantity')
      .addSelect('COUNT(*)',            'listingCount')
      .where('l.isActive = :a', { a: true })
      .groupBy('crop.name')
      .getRawMany();
  }

  async getDistrictAnalytics() {
    return this.listingsRepo
      .createQueryBuilder('l')
      .select('l.district',     'district')
      .addSelect('COUNT(*)',    'listingCount')
      .addSelect('SUM(l.quantity)', 'totalQuantity')
      .addSelect('AVG(l.pricePerUnit)', 'avgPrice')
      .where('l.isActive = :a', { a: true })
      .groupBy('l.district')
      .getRawMany();
  }

  async getUserActivity(userId: string) {
    const [listings, deals] = await Promise.all([
      this.listingsRepo.count({ where: { farmerId: userId } }),
      this.dealsRepo.count({ where: [{ buyerId: userId }, { farmerId: userId }] } as any),
    ]);
    return { listings, deals };
  }
}
