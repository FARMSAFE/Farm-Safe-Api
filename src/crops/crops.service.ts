import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Injectable()
export class CropsService {
  constructor(@InjectRepository(Crop) private repo: Repository<Crop>) {}

  async create(dto: CreateCropDto): Promise<Crop> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(category?: string): Promise<Crop[]> {
    return this.repo.find({
      where: { isActive: true, ...(category ? { category: category as any } : {}) },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.repo.findOne({ where: { id } });
    if (!crop) throw new NotFoundException(`Crop ${id} not found`);
    return crop;
  }

  async update(id: string, dto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findOne(id);
    return this.repo.save(Object.assign(crop, dto));
  }

  async remove(id: string): Promise<void> {
    const crop = await this.findOne(id);
    crop.isActive = false;
    await this.repo.save(crop);
  }
}
