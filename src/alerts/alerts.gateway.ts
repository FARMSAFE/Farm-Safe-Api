import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class AlertsGateway {
  @WebSocketServer() server: Server;
  broadcastAlert(alert: any) { this.server.emit('new_alert', alert); }
}
