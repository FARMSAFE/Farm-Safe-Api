import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  cropId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @IsNotEmpty()
  pricePerUnit: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  harvestDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiryDate?: Date;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsOptional()
  village?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  images?: string[];
}
