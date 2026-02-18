import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private repo: Repository<Message>) {}

  async create(senderId: string, dto: CreateMessageDto): Promise<Message> {
    return this.repo.save(this.repo.create({ ...dto, senderId }));
  }

  async findConversation(userId1: string, userId2: string): Promise<Message[]> {
    return this.repo.find({
      where: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      order: { createdAt: 'ASC' },
    });
  }

  async findUserMessages(userId: string): Promise<Message[]> {
    return this.repo.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Message> {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException(`Message ${id} not found`);
    m.isRead = true;
    return this.repo.save(m);
  }
}
