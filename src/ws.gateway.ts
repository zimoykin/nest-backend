import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
 } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketClient } from './Sockets/SocketClient';

@WebSocketGateway()
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  handleConnection(client: Socket, payload: string) {
    this.server.emit('handleConnection', payload);
  }
  handleDisconnect(client: Socket) {
    this.server.emit('handleDisconnect');
  }
  afterInit(server: Socket) {
    this.server.emit('afterInit');
  }
  

  clients: Array<SocketClient>

  // @SubscribeMessage('')
  // handleMessage(client: WebSocket, payload: any): string {
  //   this.clients.push(new SocketClient(client))
  //   return 'PING!';
  // }
  
}
