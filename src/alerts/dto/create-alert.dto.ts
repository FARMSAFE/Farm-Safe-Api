import {
  IsNotEmpty, IsString, IsEnum,
  IsOptional, IsArray, IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AlertType, AlertSeverity } from '../entities/alert.entity';

export class CreateAlertDto {
  @IsString()  @IsNotEmpty() title: string;
  @IsString()  @IsNotEmpty() message: string;
  @IsEnum(AlertType)         type: AlertType;
  @IsEnum(AlertSeverity)     severity: AlertSeverity;
  @IsArray()   @IsOptional() affectedDistricts?: string[];
  @IsDate() @Type(() => Date) @IsOptional() expiresAt?: Date;
}
