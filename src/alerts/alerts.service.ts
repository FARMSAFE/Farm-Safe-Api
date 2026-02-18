import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertsGateway } from './alerts.gateway';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert) private repo: Repository<Alert>,
    private gateway: AlertsGateway,
  ) {}

  async create(dto: CreateAlertDto): Promise<Alert> {
    const saved = await this.repo.save(this.repo.create(dto));
    this.gateway.broadcastAlert(saved);
    return saved;
  }

  async findAll(district?: string): Promise<Alert[]> {
    const now = new Date();
    let alerts = await this.repo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
    alerts = alerts.filter(a => !a.expiresAt || a.expiresAt > now);
    if (district) alerts = alerts.filter(a => !a.affectedDistricts?.length || a.affectedDistricts.includes(district));
    return alerts;
  }

  async findOne(id: string): Promise<Alert> {
    const a = await this.repo.findOne({ where: { id } });
    if (!a) throw new NotFoundException(`Alert ${id} not found`);
    return a;
  }

  async update(id: string, dto: Partial<CreateAlertDto>): Promise<Alert> {
    const a = await this.findOne(id);
    return this.repo.save(Object.assign(a, dto));
  }

  async remove(id: string): Promise<void> {
    const a = await this.findOne(id);
    a.isActive = false;
    await this.repo.save(a);
  }
}
