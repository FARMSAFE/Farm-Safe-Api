import {
  IsEnum, IsNotEmpty, IsOptional,
  IsString, IsInt, IsBoolean, IsArray,
} from 'class-validator';
import { CropCategory } from '../entities/crop.entity';

export class CreateCropDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() localName?: string;
  @IsEnum(CropCategory) @IsNotEmpty() category: CropCategory;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() imageUrl?: string;
  @IsString() @IsOptional() unitOfMeasure?: string;
  @IsInt()    @IsOptional() growthPeriodDays?: number;
  @IsArray()  @IsOptional() optimalSeasons?: string[];
  @IsBoolean()@IsOptional() isActive?: boolean;
}
