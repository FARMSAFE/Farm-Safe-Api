import { IsEnum, IsNotEmpty } from 'class-validator';
import { DealStatus } from '../entities/deal.entity';
export class UpdateDealStatusDto {
  @IsEnum(DealStatus) @IsNotEmpty() status: DealStatus;
}
