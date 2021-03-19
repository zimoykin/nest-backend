import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
 } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { parse } from 'cookie';
import { SocketClient } from './Sockets/SocketClient';
import { SocketMessage } from './Sockets/SocketMessahe';
import { ValidationPipe } from '@nestjs/common';

@WebSocketGateway()
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, payload: string) {
    this.addClient(client)
    const cookie: string = client.handshake.headers.cookie;
    // const { Authentication: jwtPayload } = parse(cookie);
    // if (!jwtPayload) {
    //   console.log ('unauthorized!')
    // }
    this.server.emit(`${client.id} connected`)
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter( val => { 
      return val.id != client.id}
    )
    console.log(`clients: ${this.clients.length}`)
  }
  afterInit(server: Socket) {
    this.server.emit('welcome');
  }
  
  clients: Array<SocketClient> = new Array<SocketClient>();

  @SubscribeMessage('PING')
  handlePing(client: Socket): Promise<string> {
    return new Promise ( resolve => {
      setTimeout( () => {
      console.log(`${client.id}: ping`)
      resolve('PONG!');
      }, 3000)
    })

  }

  @SubscribeMessage('online')
  handleAll(client: Socket, payload: any): string {
    console.log(`${client.id}: ${payload}`)
    return 'hellYeah!';
  }
  @SubscribeMessage('message')
  handleMessage(@MessageBody(new ValidationPipe())
                payload: SocketMessage, 
                @ConnectedSocket() client: Socket) {
    console.log(`${client.id}: ${payload}`)
    if (this.clients.filter(val =>{ return val.id == client.id}).length > 0) {
      this.clients.filter( val => { return val.id != client.id}).map ( oth => {
        oth.ws.emit(JSON.stringify(payload));
       })
    }
  }

  addClient (client: Socket) {
    this.clients = this.clients.filter( val => { 
      return val.id != client.id}
    )
    this.clients.push(new SocketClient(client, client.id))
    console.log(`clients: ${this.clients.length}`)
  }
  
  
}
