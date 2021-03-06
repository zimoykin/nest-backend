import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { SocketClient } from './_CONTROLLER/Sockets/SocketClient'
import { isJWT } from 'class-validator'
import { UsersService } from './_SERVICES/user/user.service'
import { Message } from './_MODEL/message.entity'
import * as jwt from 'jsonwebtoken'

const jwt_secret = process.env.JWTSECRET

@WebSocketGateway()
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server
  clients = new Array<SocketClient>()

  constructor(private users: UsersService) {}

  handleConnection(client: Socket) {
    if (client.handshake.query.token) {
      if (isJWT(client.handshake.query.token)) {
        const token = client.handshake.query.token
        if (!token) {
          client.disconnect()
        }
        jwt.verify(token, jwt_secret, async (err: Error, payload: any) => {
          if (err) {
            client.disconnect()
            return
          }
          if (payload.id) {
            this.addClient(client, payload.id).then(() => {
              console.log('client authorized')
              this.sendOnline()
            })
          }
        })
      }
    } else {
      client.disconnect()
      console.log('disconect')
    }
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter((val) => {
      return val.id != client.id
    })
    console.log(`client: ${client.id} disconected`)
    console.log(`clients: ${this.clients.length}`)

    this.sendOnline()
  }

  afterInit() {
    this.server.emit('welcome')
    this.sendOnline()
  }

  public sendMessage(message: Message) {
    console.log('send message to socket!')
    this.clients.map((client) => {
      const filtred = message.chat.users.filter((val) => {
        return val.id === client.user
      })
      if (filtred.length > 0) {
        client.ws.emit('message', message)
      }
    })
  }

  async addClient(client: Socket, userid: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clients = this.clients.filter((val) => {
        return val.id != client.id
      })
      this.users
        .readRaw({ id: userid })
        .then((user) => {
          if (user != undefined) {
            this.clients.push(new SocketClient(client, client.id, user.id))
            resolve()
          } else {
            reject()
          }
        })
        .catch((err) => console.log(err))
    })
  }

  sendOnline() {
    this.clients.forEach((val) => {
      val.ws.emit('online', {
        users: this.clients.map((val) => {
          return val.user
        }),
      })
    })
  }
}
