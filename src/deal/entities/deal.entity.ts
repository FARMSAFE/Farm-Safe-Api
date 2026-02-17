
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';

export enum DealStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  dealNumber: string;

  // Who's involved
  @Column()
  farmerId: string;

  @Column()
  buyerId: string;

  // What's being sold
  @Column({ nullable: true })
  listingId: string;

  @Column()
  cropName: string;

  @Column('decimal')
  quantity: number;

  @Column()
  unit: string;

  @Column('decimal')
  price: number;

  @Column('decimal')
  totalAmount: number;

  // When and where
  @Column()
  deliveryLocation: string;

  @Column({ type: 'date', nullable: true })
  deliveryDate: Date;

  // Status
  @Column({
    type: 'enum',
    enum: DealStatus,
    default: DealStatus.PENDING
  })
  status: DealStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'farmerId' })
  farmer: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @ManyToOne(() => Listing)
  @JoinColumn({ name: 'listingId' })
  listing: Listing;
}