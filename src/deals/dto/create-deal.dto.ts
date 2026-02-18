import {
  IsNotEmpty, IsString, IsNumber, IsOptional, IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDealDto {
  @IsString() @IsNotEmpty() buyerId: string;
  @IsString() @IsNotEmpty() farmerId: string;
  @IsString() @IsOptional() listingId?: string;
  @IsString() @IsOptional() procurementRequestId?: string;
  @IsNumber() quantity: number;
  @IsString() @IsNotEmpty() unit: string;
  @IsNumber() agreedPrice: number;
  @IsDate() @Type(() => Date) @IsOptional() deliveryDate?: Date;
  @IsString() @IsOptional() deliveryLocation?: string;
  @IsString() @IsOptional() terms?: string;
}
