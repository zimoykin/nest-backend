import { Socket } from 'socket.io';

export class SocketClient {
    
    id: string
    user?: string
    ws: Socket

    constructor(client: Socket, id: string, user?: string){
        this.id = id;
        this.ws = client;
        this.user = user;
    }

}