// src/deal/deal.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal, DealStatus } from './entities/deal.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@Injectable()
export class DealService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
  ) {}

  async create(createDealDto: CreateDealDto): Promise<Deal> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await this.dealRepository.count();
    const dealNumber = `D${year}${month}${(count + 1).toString().padStart(4, '0')}`;

    const totalAmount = createDealDto.quantity * createDealDto.price;

    const deal = this.dealRepository.create({
      ...createDealDto,
      dealNumber,
      totalAmount,
    });

    return await this.dealRepository.save(deal);
  }

  async findAll(): Promise<Deal[]> {
    return await this.dealRepository.find({
      relations: ['farmer', 'buyer'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByFarmer(farmerId: string): Promise<Deal[]> {
    return await this.dealRepository.find({
      where: { farmerId },
      relations: ['buyer'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByBuyer(buyerId: string): Promise<Deal[]> {
    return await this.dealRepository.find({
      where: { buyerId },
      relations: ['farmer'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Deal> {
    const deal = await this.dealRepository.findOne({
      where: { id },
      relations: ['farmer', 'buyer']
    });

    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    return deal;
  }

  async update(id: string, updateDealDto: UpdateDealDto): Promise<Deal> {
    const deal = await this.findOne(id);

    if (updateDealDto.quantity || updateDealDto.price) {
      const quantity = updateDealDto.quantity ?? deal.quantity;
      const price = updateDealDto.price ?? deal.price;
      updateDealDto['totalAmount'] = quantity * price;
    }

    Object.assign(deal, updateDealDto);
    return await this.dealRepository.save(deal);
  }

  async remove(id: string): Promise<{ message: string }> {
    const deal = await this.findOne(id);
    await this.dealRepository.remove(deal);
    return { message: `Deal ${id} deleted successfully` };
  }
}