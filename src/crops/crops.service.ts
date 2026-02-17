import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Injectable()
export class CropsService {
  constructor(
    @InjectRepository(Crop)
    private cropsRepository: Repository<Crop>,
  ) {}

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    const crop = this.cropsRepository.create(createCropDto);
    return await this.cropsRepository.save(crop);
  }

  async findAll(category?: string): Promise<Crop[]> {
    const query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }

    return await this.cropsRepository.find({
      where: query,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropsRepository.findOne({
      where: { id },
    });

    if (!crop) {
      throw new NotFoundException(`Crop with ID ${id} not found`);
    }

    return crop;
  }

  async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findOne(id);
    Object.assign(crop, updateCropDto);
    return await this.cropsRepository.save(crop);
  }

  async remove(id: string): Promise<void> {
    const crop = await this.findOne(id);
    crop.isActive = false;
    await this.cropsRepository.save(crop);
  }
}
