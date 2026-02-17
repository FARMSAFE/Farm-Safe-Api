
import { Expose, Transform } from 'class-transformer';

export class DealResponseDto {
  @Expose()
  id: string;

  @Expose()
  dealNumber: string;

  @Expose()
  farmerId: string;

  @Expose()
  @Transform(({ obj }) => obj.farmer?.firstName + ' ' + obj.farmer?.lastName)
  farmerName: string;

  @Expose()
  buyerId: string;

  @Expose()
  @Transform(({ obj }) => obj.buyer?.firstName + ' ' + obj.buyer?.lastName)
  buyerName: string;

  @Expose()
  cropName: string;

  @Expose()
  quantity: number;

  @Expose()
  unit: string;

  @Expose()
  price: number;

  @Expose()
  totalAmount: number;

  @Expose()
  deliveryLocation: string;

  @Expose()
  deliveryDate: Date;

  @Expose()
  status: string;

  @Expose()
  notes: string;

  @Expose()
  createdAt: Date;

  @Expose()
  completedAt: Date;
}