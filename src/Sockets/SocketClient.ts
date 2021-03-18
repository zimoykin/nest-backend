import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';

export class SocketClient {
    
    id: string
    ws: Socket

    constructor(client: Socket){
        this.id = uuid();
        this.ws = client;
    }

}