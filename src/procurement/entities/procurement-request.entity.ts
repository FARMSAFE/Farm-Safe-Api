import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Crop } from '../../crops/entities/crop.entity';

export enum ProcurementStatus {
  OPEN        = 'open',
  IN_PROGRESS = 'in_progress',
  FULFILLED   = 'fulfilled',
  CANCELLED   = 'cancelled',
}

@Entity('procurement_requests')
export class ProcurementRequest {
  @PrimaryGeneratedColumn('uuid') id: string;

  /** MERGE STEP: uncomment @ManyToOne buyer relation */
  @Column() buyerId: string;
  // @ManyToOne(() => User, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'buyerId' })
  // buyer: User;

  @Column() cropId: string;
  @ManyToOne(() => Crop) @JoinColumn({ name: 'cropId' }) crop: Crop;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) quantityNeeded: number;
  @Column() unit: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) maxPricePerUnit: number;
  @Column() deliveryDeadline: Date;
  @Column({ nullable: true }) district: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'simple-array', nullable: true }) preferredDistricts: string[];
  @Column({ type: 'enum', enum: ProcurementStatus, default: ProcurementStatus.OPEN })
  status: ProcurementStatus;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
