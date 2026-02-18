import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ClimateData } from './entities/climate-data.entity';
import { CreateClimateDto } from './dto/create-climate.dto';

@Injectable()
export class ClimateService {
  constructor(@InjectRepository(ClimateData) private repo: Repository<ClimateData>) {}

  async create(dto: CreateClimateDto): Promise<ClimateData> {
    return this.repo.save(this.repo.create(dto));
  }

  async findByDistrict(district: string, days = 7): Promise<ClimateData[]> {
    const end = new Date(), start = new Date();
    start.setDate(start.getDate() - days);
    return this.repo.find({ where: { district, date: Between(start, end) }, order: { date: 'DESC' } });
  }

  async findLatest(district: string): Promise<ClimateData> {
    const d = await this.repo.findOne({ where: { district }, order: { date: 'DESC' } });
    if (!d) throw new NotFoundException(`No climate data for ${district}`);
    return d;
  }

  async getAllDistricts(): Promise<string[]> {
    const rows = await this.repo.createQueryBuilder('c')
      .select('DISTINCT c.district', 'district').getRawMany();
    return rows.map(r => r.district);
  }
}
