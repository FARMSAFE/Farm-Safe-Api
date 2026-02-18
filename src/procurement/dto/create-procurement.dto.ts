import {
  IsNotEmpty, IsString, IsNumber,
  IsOptional, IsArray, IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProcurementDto {
  @IsString()  @IsNotEmpty() cropId: string;
  @IsNumber()               quantityNeeded: number;
  @IsString()  @IsNotEmpty() unit: string;
  @IsNumber()  @IsOptional() maxPricePerUnit?: number;
  @IsDate() @Type(() => Date) deliveryDeadline: Date;
  @IsString()  @IsOptional() district?: string;
  @IsString()  @IsOptional() description?: string;
  @IsArray()   @IsOptional() preferredDistricts?: string[];
}
