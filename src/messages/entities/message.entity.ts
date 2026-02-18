import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid') id: string;

  /** MERGE STEP: uncomment @ManyToOne sender/receiver relations */
  @Column() senderId: string;
  // @ManyToOne(() => User, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'senderId' })
  // sender: User;

  @Column() receiverId: string;
  // @ManyToOne(() => User, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'receiverId' })
  // receiver: User;

  @Column({ type: 'text' }) content: string;
  @Column({ nullable: true }) listingId: string;
  @Column({ nullable: true }) procurementRequestId: string;
  @Column({ nullable: true }) dealId: string;
  @Column({ default: false }) isRead: boolean;
  @CreateDateColumn() createdAt: Date;
}
