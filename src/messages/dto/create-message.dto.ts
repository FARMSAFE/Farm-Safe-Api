import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class CreateMessageDto {
  @IsString() @IsNotEmpty() receiverId: string;
  @IsString() @IsNotEmpty() content: string;
  @IsString() @IsOptional() listingId?: string;
  @IsString() @IsOptional() procurementRequestId?: string;
  @IsString() @IsOptional() dealId?: string;
}
