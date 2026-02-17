
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDealDto {
  @IsUUID()
  @IsNotEmpty()
  farmerId: string;

  @IsUUID()
  @IsNotEmpty()
  buyerId: string;

  @IsUUID()
  @IsOptional()
  listingId?: string;

  @IsString()
  @IsNotEmpty()
  cropName: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsString()
  @IsNotEmpty()
  deliveryLocation: string;

  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}