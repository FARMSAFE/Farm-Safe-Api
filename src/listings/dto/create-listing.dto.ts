import {
  IsNotEmpty, IsString, IsNumber,
  IsOptional, IsArray, IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @IsString()  @IsNotEmpty() cropId: string;
  @IsNumber()               quantity: number;
  @IsString()  @IsNotEmpty() unit: string;
  @IsNumber()               pricePerUnit: number;
  @IsDate() @Type(() => Date) harvestDate: Date;
  @IsDate() @Type(() => Date) @IsOptional() expiryDate?: Date;
  @IsString()  @IsNotEmpty() district: string;
  @IsString()  @IsOptional() village?: string;
  @IsNumber()  @IsOptional() latitude?: number;
  @IsNumber()  @IsOptional() longitude?: number;
  @IsString()  @IsOptional() description?: string;
  @IsArray()   @IsOptional() images?: string[];
}
