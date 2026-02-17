
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsPhoneNumber, MinLength, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../user/entities/user.entity';

class AddressDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;
}

class BusinessInfoDto {
  @IsString()
  @IsOptional()
  farmName?: string;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  yearsOfExperience?: number;

  @IsString()
  @IsOptional()
  farmSize?: number;

  @IsString()
  @IsOptional()
  farmSizeUnit?: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @ValidateNested()
  @Type(() => BusinessInfoDto)
  @IsOptional()
  businessInfo?: BusinessInfoDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredCrops?: string[];
}