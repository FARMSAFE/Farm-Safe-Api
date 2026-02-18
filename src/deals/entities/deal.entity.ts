import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
import { ProcurementRequest } from '../../procurement/entities/procurement-request.entity';

export enum DealStatus {
  PENDING     = 'pending',
  ACCEPTED    = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED   = 'completed',
  CANCELLED   = 'cancelled',
}

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid') id: string;

  /** MERGE STEP: uncomment @ManyToOne buyer/farmer relations */
  @Column() buyerId: string;
  // @ManyToOne(() => User) @JoinColumn({ name: 'buyerId' }) buyer: User;

  @Column() farmerId: string;
  // @ManyToOne(() => User) @JoinColumn({ name: 'farmerId' }) farmer: User;

  @Column({ nullable: true }) listingId: string;
  @ManyToOne(() => Listing, { nullable: true }) @JoinColumn({ name: 'listingId' }) listing: Listing;

  @Column({ nullable: true }) procurementRequestId: string;
  @ManyToOne(() => ProcurementRequest, { nullable: true })
  @JoinColumn({ name: 'procurementRequestId' }) procurementRequest: ProcurementRequest;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) quantity: number;
  @Column() unit: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) agreedPrice: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) totalAmount: number;
  @Column({ nullable: true }) deliveryDate: Date;
  @Column({ nullable: true }) deliveryLocation: string;
  @Column({ type: 'text', nullable: true }) terms: string;
  @Column({ type: 'enum', enum: DealStatus, default: DealStatus.PENDING }) status: DealStatus;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
