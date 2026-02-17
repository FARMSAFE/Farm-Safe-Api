import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  // TODO: Add @UseGuards(JwtAuthGuard) when auth module is ready
  // For now, senderId should be passed in body for testing
  create(@Body() body: CreateMessageDto & { senderId: string }) {
    const { senderId, ...createMessageDto } = body;
    return this.messagesService.create(senderId, createMessageDto);
  }

  @Get('user/:userId')
  // TODO: This will become 'my-messages' when auth is integrated
  findUserMessages(@Param('userId') userId: string) {
    return this.messagesService.findUserMessages(userId);
  }

  @Get('conversation')
  // TODO: Add @UseGuards(JwtAuthGuard) when auth module is ready
  findConversation(
    @Query('userId1') userId1: string,
    @Query('userId2') userId2: string,
  ) {
    return this.messagesService.findConversation(userId1, userId2);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }
}
