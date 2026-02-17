import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
  ) {}

  async create(farmerId: string, createListingDto: CreateListingDto): Promise<Listing> {
    const listing = this.listingsRepository.create({
      ...createListingDto,
      farmerId,
    });
    return await this.listingsRepository.save(listing);
  }

  async findAll(filters?: any): Promise<Listing[]> {
    const query: any = { isActive: true };
    
    if (filters?.cropId) query.cropId = filters.cropId;
    if (filters?.district) query.district = filters.district;
    if (filters?.status) query.status = filters.status;

    return await this.listingsRepository.find({
      where: query,
      relations: ['crop'], // Only load crop relation (user relation commented out in entity)
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: ['crop'],
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    return listing;
  }

  async findByFarmer(farmerId: string): Promise<Listing[]> {
    return await this.listingsRepository.find({
      where: { farmerId },
      relations: ['crop'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, farmerId: string, updateListingDto: UpdateListingDto): Promise<Listing> {
    const listing = await this.findOne(id);

    if (listing.farmerId !== farmerId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    Object.assign(listing, updateListingDto);
    return await this.listingsRepository.save(listing);
  }

  async remove(id: string, farmerId: string): Promise<void> {
    const listing = await this.findOne(id);

    if (listing.farmerId !== farmerId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    listing.isActive = false;
    await this.listingsRepository.save(listing);
  }

  async updateStatus(id: string, status: ListingStatus): Promise<Listing> {
    const listing = await this.findOne(id);
    listing.status = status;
    return await this.listingsRepository.save(listing);
  }
}
