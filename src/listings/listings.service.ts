import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private repo: Repository<Listing>) {}

  async create(farmerId: string, dto: CreateListingDto): Promise<Listing> {
    return this.repo.save(this.repo.create({ ...dto, farmerId }));
  }

  async findAll(filters?: any): Promise<Listing[]> {
    const where: any = { isActive: true };
    if (filters?.cropId)   where.cropId  = filters.cropId;
    if (filters?.district) where.district = filters.district;
    if (filters?.status)   where.status   = filters.status;
    return this.repo.find({ where, relations: ['crop'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Listing> {
    const l = await this.repo.findOne({ where: { id }, relations: ['crop'] });
    if (!l) throw new NotFoundException(`Listing ${id} not found`);
    return l;
  }

  async findByFarmer(farmerId: string): Promise<Listing[]> {
    return this.repo.find({ where: { farmerId }, relations: ['crop'], order: { createdAt: 'DESC' } });
  }

  async update(id: string, farmerId: string, dto: UpdateListingDto): Promise<Listing> {
    const l = await this.findOne(id);
    if (l.farmerId !== farmerId) throw new ForbiddenException('Not your listing');
    return this.repo.save(Object.assign(l, dto));
  }

  async remove(id: string, farmerId: string): Promise<void> {
    const l = await this.findOne(id);
    if (l.farmerId !== farmerId) throw new ForbiddenException('Not your listing');
    l.isActive = false;
    await this.repo.save(l);
  }
}
