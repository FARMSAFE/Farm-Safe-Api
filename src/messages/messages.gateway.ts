import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.users.set(userId, client.id);
      console.log(`User connected: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.users.forEach((socketId, userId) => {
      if (socketId === client.id) {
        this.users.delete(userId);
        console.log(`User disconnected: ${userId}`);
      }
    });
  }

  @SubscribeMessage('send_message')
  handleMessage(client: Socket, payload: any) {
    const receiverSocketId = this.users.get(payload.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', payload);
    }
  }
}
