import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateDealDto } from './create-deal.dto';
import { DealStatus } from '../entities/deal.entity';

export class UpdateDealDto extends PartialType(CreateDealDto) {
  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}