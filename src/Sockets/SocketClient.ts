import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';

export class SocketClient {
    
    id: string
    ws: Socket

    constructor(client: Socket, id: string){
        this.id = id;
        this.ws = client;
    }

}