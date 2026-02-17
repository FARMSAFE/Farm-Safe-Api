import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CropCategory {
  CEREALS = 'cereals',
  LEGUMES = 'legumes',
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits',
  TUBERS = 'tubers',
  OTHER = 'other',
}

@Entity('crops')
export class Crop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  localName: string;

  @Column({
    type: 'enum',
    enum: CropCategory,
    default: CropCategory.OTHER,
  })
  category: CropCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  unitOfMeasure: string;

  @Column({ type: 'int', nullable: true })
  growthPeriodDays: number;

  @Column({ type: 'simple-array', nullable: true })
  optimalSeasons: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
