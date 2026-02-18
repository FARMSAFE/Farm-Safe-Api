import {
  IsNotEmpty, IsString, IsNumber, IsOptional, IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClimateDto {
  @IsString()  @IsNotEmpty() district: string;
  @IsNumber()  @IsOptional() temperature?: number;
  @IsNumber()  @IsOptional() rainfall?: number;
  @IsNumber()  @IsOptional() humidity?: number;
  @IsNumber()  @IsOptional() ndvi?: number;
  @IsString()  @IsOptional() weatherCondition?: string;
  @IsOptional() forecast?: any;
  @IsDate() @Type(() => Date) date: Date;
}
