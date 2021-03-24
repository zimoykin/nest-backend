import { IsString } from 'class-validator';
import { Socket } from 'socket.io';
import { MessageType } from '../../_UTILS/enums/MessageType';

export class SocketMessage {
    
    @IsString()
    clientid: string
    @IsString()
    message: string
    type: MessageType

    constructor(message: string, clientid: string){
        this.clientid = clientid;
        this.message = message;
        this.type = MessageType.chatMessage
    }

}