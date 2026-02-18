import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcurementRequest } from './entities/procurement-request.entity';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { UpdateProcurementDto } from './dto/update-procurement.dto';

@Injectable()
export class ProcurementService {
  constructor(@InjectRepository(ProcurementRequest) private repo: Repository<ProcurementRequest>) {}

  async create(buyerId: string, dto: CreateProcurementDto): Promise<ProcurementRequest> {
    return this.repo.save(this.repo.create({ ...dto, buyerId }));
  }

  async findAll(filters?: any): Promise<ProcurementRequest[]> {
    const where: any = { isActive: true };
    if (filters?.cropId)   where.cropId   = filters.cropId;
    if (filters?.district) where.district  = filters.district;
    if (filters?.status)   where.status    = filters.status;
    return this.repo.find({ where, relations: ['crop'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ProcurementRequest> {
    const p = await this.repo.findOne({ where: { id }, relations: ['crop'] });
    if (!p) throw new NotFoundException(`Procurement request ${id} not found`);
    return p;
  }

  async findByBuyer(buyerId: string): Promise<ProcurementRequest[]> {
    return this.repo.find({ where: { buyerId }, relations: ['crop'], order: { createdAt: 'DESC' } });
  }

  async update(id: string, buyerId: string, dto: UpdateProcurementDto): Promise<ProcurementRequest> {
    const p = await this.findOne(id);
    if (p.buyerId !== buyerId) throw new ForbiddenException('Not your request');
    return this.repo.save(Object.assign(p, dto));
  }

  async remove(id: string, buyerId: string): Promise<void> {
    const p = await this.findOne(id);
    if (p.buyerId !== buyerId) throw new ForbiddenException('Not your request');
    p.isActive = false;
    await this.repo.save(p);
  }
}
