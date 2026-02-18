import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity('climate_data')
export class ClimateData {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() district: string;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) temperature: number;
  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true }) rainfall: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) humidity: number;
  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true }) ndvi: number;
  @Column({ nullable: true }) weatherCondition: string;
  @Column({ type: 'json', nullable: true }) forecast: any;
  @Column() date: Date;
  @CreateDateColumn() createdAt: Date;
}
