import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../listings/entities/listing.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    // TODO: Add other repositories when modules are ready
    // @InjectRepository(ProcurementRequest)
    // private procurementRepository: Repository<ProcurementRequest>,
    // @InjectRepository(Deal)
    // private dealsRepository: Repository<Deal>,
    // @InjectRepository(User)
    // private usersRepository: Repository<User>,
  ) {}

  async getDashboardStats(): Promise<any> {
    // Basic stats with only Listings available
    const totalListings = await this.listingsRepository.count();
    const activeListings = await this.listingsRepository.count({ 
      where: { isActive: true } 
    });

    return {
      listings: { 
        total: totalListings, 
        active: activeListings 
      },
      // TODO: Uncomment when other modules are ready
      // procurement: { total: totalProcurement, active: activeProcurement },
      // deals: { total: totalDeals, completed: completedDeals },
      // users: { farmers: totalFarmers, buyers: totalBuyers },
    };
  }

  async getMarketTrends(): Promise<any> {
    const listings = await this.listingsRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.crop', 'crop')
      .select('crop.name', 'cropName')
      .addSelect('AVG(listing.pricePerUnit)', 'avgPrice')
      .addSelect('SUM(listing.quantity)', 'totalQuantity')
      .addSelect('COUNT(*)', 'listingCount')
      .where('listing.isActive = :isActive', { isActive: true })
      .groupBy('crop.name')
      .getRawMany();

    return listings;
  }

  async getDistrictAnalytics(): Promise<any> {
    const districtData = await this.listingsRepository
      .createQueryBuilder('listing')
      .select('listing.district', 'district')
      .addSelect('COUNT(*)', 'listingCount')
      .addSelect('SUM(listing.quantity)', 'totalQuantity')
      .where('listing.isActive = :isActive', { isActive: true })
      .groupBy('listing.district')
      .getRawMany();

    return districtData;
  }

  async getUserActivity(userId: string): Promise<any> {
    // TODO: Determine user role when User module is ready
    // For now, just count listings by farmer
    const listings = await this.listingsRepository.count({ 
      where: { farmerId: userId } 
    });
    
    return { 
      listings,
      // TODO: Add deals count when Deal module is ready
      // deals: dealCount 
    };
  }
}
