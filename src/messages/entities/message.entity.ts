import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
// TODO: Uncomment when User module is ready
// import { User } from '../../users/entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderId: string;

  // TODO: Uncomment when User module is ready
  // @ManyToOne(() => User, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'senderId' })
  // sender: User;

  @Column()
  receiverId: string;

  // TODO: Uncomment when User module is ready
  // @ManyToOne(() => User, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'receiverId' })
  // receiver: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  listingId: string;

  @Column({ nullable: true })
  procurementRequestId: string;

  @Column({ nullable: true })
  dealId: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
