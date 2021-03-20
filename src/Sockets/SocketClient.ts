import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';
import { UserOutputDto } from 'src/dto/user.dto';

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