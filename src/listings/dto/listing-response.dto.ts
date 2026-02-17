export class ListingResponseDto {
  id: string;
  farmer: any;
  crop: any;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  harvestDate: Date;
  district: string;
  village: string;
  status: string;
  createdAt: Date;
}
