import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateProcurementDto } from './create-procurement.dto';
import { ProcurementStatus } from '../entities/procurement-request.entity';

export class UpdateProcurementDto extends PartialType(CreateProcurementDto) {
  @IsEnum(ProcurementStatus) @IsOptional() status?: ProcurementStatus;
}
