import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal, DealStatus } from './entities/deal.entity';
import { CreateDealDto } from './dto/create-deal.dto';

@Injectable()
export class DealsService {
  constructor(@InjectRepository(Deal) private repo: Repository<Deal>) {}

  async create(dto: CreateDealDto): Promise<Deal> {
    return this.repo.save(
      this.repo.create({ ...dto, totalAmount: dto.quantity * dto.agreedPrice }),
    );
  }

  async findAll(): Promise<Deal[]> {
    return this.repo.find({ relations: ['listing', 'procurementRequest'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Deal> {
    const d = await this.repo.findOne({ where: { id }, relations: ['listing', 'procurementRequest'] });
    if (!d) throw new NotFoundException(`Deal ${id} not found`);
    return d;
  }

  async findByUser(userId: string): Promise<Deal[]> {
    return this.repo.find({
      where: [{ buyerId: userId }, { farmerId: userId }],
      relations: ['listing'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: DealStatus, userId: string): Promise<Deal> {
    const d = await this.findOne(id);
    if (d.buyerId !== userId && d.farmerId !== userId)
      throw new ForbiddenException('You are not part of this deal');
    d.status = status;
    return this.repo.save(d);
  }
}
