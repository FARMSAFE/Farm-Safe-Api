import {
  WebSocketGateway, WebSocketServer,
  SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users = new Map<string, string>(); // userId → socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) this.users.set(userId, client.id);
  }

  handleDisconnect(client: Socket) {
    this.users.forEach((sid, uid) => { if (sid === client.id) this.users.delete(uid); });
  }

  @SubscribeMessage('send_message')
  handleMessage(_client: Socket, payload: any) {
    const sid = this.users.get(payload.receiverId);
    if (sid) this.server.to(sid).emit('receive_message', payload);
  }
}
