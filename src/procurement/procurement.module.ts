import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcurementService } from './procurement.service';
import { ProcurementController } from './procurement.controller';
import { ProcurementRequest } from './entities/procurement-request.entity';
import { CropsModule } from '../crops/crops.module';

@Module({
  imports:     [TypeOrmModule.forFeature([ProcurementRequest]), CropsModule],
  controllers: [ProcurementController],
  providers:   [ProcurementService],
  exports:     [ProcurementService, TypeOrmModule],
})
export class ProcurementModule {}
