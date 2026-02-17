import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// TODO: Uncomment when User module is ready
// import { User } from '../../users/entities/user.entity';

// TODO: Import from crops module when integrated
// For now, just reference by ID
import { Crop } from '../../crops/entities/crop.entity';

export enum ListingStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  EXPIRED = 'expired',
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  farmerId: string;

  // TODO: Uncomment when User module is ready
  // @ManyToOne(() => User, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'farmerId' })
  // farmer: User;

  @Column()
  cropId: string;

  @ManyToOne(() => Crop)
  @JoinColumn({ name: 'cropId' })
  crop: Crop;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column()
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerUnit: number;

  @Column()
  harvestDate: Date;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column()
  district: string;

  @Column({ nullable: true })
  village: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.AVAILABLE,
  })
  status: ListingStatus;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
