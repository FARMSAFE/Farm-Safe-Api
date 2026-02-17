
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
//import { Deal } from '../../deals/entities/deal.entity';
import { Message } from '../../messages/entities/message.entity';

export enum UserRole {
  FARMER = 'farmer',
  BUYER = 'buyer',
  AGGREGATOR = 'aggregator',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 20, unique: true, nullable: true })
  phoneNumber: string;

  
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'jsonb', nullable: true })
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  businessInfo: {
    farmName?: string;
    businessName?: string;
    registrationNumber?: string;
    taxId?: string;
    yearsOfExperience?: number;
    farmSize?: number;
    farmSizeUnit?: string;
    certifications?: string[];
  };

  @Column({ type: 'simple-array', nullable: true })
  preferredCrops: string[];

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;




  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Listing, listing => listing.farmerId)
  listings: Listing[];

 // @OneToMany(() => Deal, deal => deal.farmerId)
 // farmerDeals: Deal[];

 // @OneToMany(() => Deal, deal => deal.buyerId)
 // buyerDeals: Deal[];

  @OneToMany(() => Message, message => message.senderId)
  sentMessages: Message[];

  @OneToMany(() => Message, message => message.receiverId)
  receivedMessages: Message[];
}