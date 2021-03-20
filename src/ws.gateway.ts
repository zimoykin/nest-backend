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
import { UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { UsersService } from './user/user.service';
import { UserAccess, UserInputDto, UserOutputDto } from './dto/user.dto';
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWTSECRET;

@WebSocketGateway()
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;
  clients: Array<SocketClient> = new Array<SocketClient>();

  constructor(private users: UsersService) {}

  handleConnection(client: Socket) {
    if (client.handshake.query.token) {
      if (isJWT(client.handshake.query.token)) {
        let token = client.handshake.query.token
        if (!token) { client.disconnect() }
        jwt.verify(token, jwt_secret, async (err: Error, payload) => { 
          if (err) {
            console.log('disconect')
            client.disconnect() 
          }
          this.addClient(client, payload.id)
        })
      }
    } else {
      client.disconnect()
      console.log('disconect')
    }
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter( val => { 
      return val.id != client.id}
    )
    console.log(`client: ${client.id} disconected`)
    console.log(`clients: ${this.clients.length}`)
  }

  afterInit(server: Socket) {
    this.server.emit('welcome');
  }

  @SubscribeMessage('PING')
  handlePing(client: Socket): Promise<string> {
    return new Promise ( resolve => {
      setTimeout( () => {
      console.log(`${client.id}: ping`)
      resolve('PONG!');
      }, 3000)
    })

  }

  @SubscribeMessage( 'online' )
  handleAll(client: Socket, payload: any) {

    let users = this.clients.filter( val => {
      return val.id == client.id }
    )

    if (users.length > 0) {
      this.server.emit( 'welcome' , JSON.stringify( 
        {id: client.id, user: users[0].user || '' } 
      ))
    }

    this.clients.forEach ( val => {
        val.ws.emit ('online', { users: 
          this.clients.map( val => { return val.user })
        })}
    ) 
  }

  @SubscribeMessage( 'message' )
  handleMessage(@MessageBody(new ValidationPipe())
                payload: SocketMessage, 
                @ConnectedSocket() client: Socket) {
    console.log(`${client.id}: ${payload}`)


  }

  async addClient (client: Socket, userid: string) : Promise<void> {

    return new Promise ( (resolve, reject) => {

      this.clients = this.clients.filter( val => { 
        return val.id != client.id}
      )
  
      this.users.read( {id: userid} ).then ( user => {
        if (user !== undefined) {
          this.clients.push ( new SocketClient(client, client.id, user.id) )
          resolve()
        }
        else { 
          reject()
        }
      })

    })

  }
  
  
}
