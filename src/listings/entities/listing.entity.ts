import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Crop } from '../../crops/entities/crop.entity';

export enum ListingStatus {
  AVAILABLE = 'available',
  RESERVED  = 'reserved',
  SOLD      = 'sold',
  EXPIRED   = 'expired',
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid') id: string;

  /**
   * farmerId stores the UUID from the User entity.
   * The @ManyToOne relation is left commented out so this module
   * compiles without the User entity.
   *
   * MERGE STEP: uncomment the three lines below and add
   *   import { User } from '../../users/entities/user.entity';
   * at the top of this file.
   */
  @Column() farmerId: string;
  // @ManyToOne(() => User, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'farmerId' })
  // farmer: User;

  @Column() cropId: string;
  @ManyToOne(() => Crop)
  @JoinColumn({ name: 'cropId' })
  crop: Crop;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) quantity: number;
  @Column() unit: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) pricePerUnit: number;
  @Column() harvestDate: Date;
  @Column({ nullable: true }) expiryDate: Date;
  @Column() district: string;
  @Column({ nullable: true }) village: string;
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) latitude: number;
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) longitude: number;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'simple-array', nullable: true }) images: string[];
  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.AVAILABLE })
  status: ListingStatus;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
