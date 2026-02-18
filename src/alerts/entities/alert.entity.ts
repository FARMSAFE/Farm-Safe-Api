import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum AlertType     { WEATHER='weather', CLIMATE='climate', PRICE='price', MARKET='market', SYSTEM='system' }
export enum AlertSeverity { INFO='info', WARNING='warning', CRITICAL='critical' }

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column({ type: 'text' }) message: string;
  @Column({ type: 'enum', enum: AlertType,     default: AlertType.SYSTEM })    type: AlertType;
  @Column({ type: 'enum', enum: AlertSeverity, default: AlertSeverity.INFO }) severity: AlertSeverity;
  @Column({ type: 'simple-array', nullable: true }) affectedDistricts: string[];
  @Column({ nullable: true }) expiresAt: Date;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
