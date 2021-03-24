import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
 } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketClient } from './_CONTROLLER/Sockets/SocketClient';
import { isJWT } from 'class-validator';
import { UsersService } from './_SERVICES/user/user.service';
import { Chat, Chats } from './_CONTROLLER/Sockets/Chat';
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWTSECRET;

@WebSocketGateway()
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;
  clients = new Array<SocketClient>();
  chats = new Array<Chats>();

  constructor(private users: UsersService) {}

  handleConnection(client: Socket) {
    if (client.handshake.query.token) {
      if (isJWT(client.handshake.query.token)) {
        let token = client.handshake.query.token
        if (!token) { client.disconnect() }
        jwt.verify(token, jwt_secret, async (err: Error, payload) => { 
          if (err) client.disconnect() 
          this.addClient(client, payload.id).then( () => {
            console.log('client authorized')
            this.sendOnline()
          })
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

    this.sendOnline()
  }

  afterInit(server: Socket) {
    this.server.emit('welcome')
    this.sendOnline()
  }

  @SubscribeMessage( 'chat' )
  chatMessage(client: Socket, chat: Chat) {

    console.log( chat )
   
    const chatfilter = this.chats.filter ( val => {
      return (val.user1 === chat.user1 &&
      val.user2 === chat.user2)
      || (val.user1 === chat.user2 &&
        val.user2 === chat.user1)
    })
    console.log( chatfilter )
    if (chatfilter.length > 0) {
      if (chat.message !== undefined && 
        chat.message.message !== 'start') {
          chatfilter[0].messages.push(chat.message)
        }
    } else {
      let newChat: Chats = {
        user1: chat.user1,
        user2: chat.user2,
        messages: [chat.message]
      }
      this.chats.push(newChat)
    }

    if (chat.message.message != 'start') {
      this.sendChatMessage(chat)
    }

  }

  async addClient (client: Socket, userid: string) : Promise<void> {

    return new Promise ( (resolve, reject) => {
      this.clients = this.clients.filter( val => { 
        return val.id != client.id}
      )
      this.users.read(userid).then ( user => {
        if (user !== undefined) {
          this.clients.push(new SocketClient(client, client.id, user.id))
          resolve()
        }
        else { 
          reject()
        }
      })
    })

  }

  sendOnline () {
    this.clients.forEach ( val => {
        val.ws.emit ('online', { users: 
          this.clients.map( val => { return val.user })
        })}
    ) 
  }

  sendChatMessage(chat: Chat) {

    const filtred = this.clients.filter( val => { 
      return val.user === chat.user1 || val.user === chat.user2
     })
    filtred.map ( client => {
      client.ws.emit ( 'chat', chat)
    })

  }
   
}
