import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  namespace: '/messages',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Map userId -> socketId for routing
  private userSockets = new Map<string, string>();

  constructor(private messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId;
    if (userId) {
      this.userSockets.set(userId, client.id);
      client.join(`user:${userId}`);
      console.log(`User ${userId} connected via WebSocket`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; content: string },
  ) {
    const senderId = client.handshake.auth?.userId;
    if (!senderId) return;

    // Save to database
    const message = await this.messagesService.create(senderId, {
      receiverId: data.receiverId,
      content: data.content,
    });

    // Emit to sender
    client.emit('newMessage', message);

    // Emit to receiver if they're online
    this.server.to(`user:${data.receiverId}`).emit('newMessage', message);

    return message;
  }
}
