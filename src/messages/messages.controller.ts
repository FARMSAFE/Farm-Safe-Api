import {
  Controller, Get, Post, Body,
  Patch, Param, UseGuards, Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthenticatedGuard } from '../shared/auth.guard';

@Controller('messages')
@UseGuards(AuthenticatedGuard)
export class MessagesController {
  constructor(private readonly svc: MessagesService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateMessageDto) {
    return this.svc.create(req.user.id, dto);
  }

  @Get()
  findMine(@Request() req: any) { return this.svc.findUserMessages(req.user.id); }

  @Get('conversation/:userId')
  findConversation(@Request() req: any, @Param('userId') other: string) {
    return this.svc.findConversation(req.user.id, other);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) { return this.svc.markAsRead(id); }
}
