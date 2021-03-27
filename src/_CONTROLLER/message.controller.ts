import { BadRequestException, Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common';
import { WsGateway } from '../ws.gateway';
import { Message } from '../_MODEL/message.entity';
import { MessageDTO } from '../_MODEL/_DTO/message.dto';
import { MessageService } from '../_SERVICES/message/message.service';
import { RestController } from './rest.controller';

@Controller('api/message')
export class MessageController  extends RestController(MessageService) {

    constructor(
        public service: MessageService,
        private ws: WsGateway
        ){
        super();
    }

    @Post('')
    createMessage(@Body( new ValidationPipe() ) input: MessageDTO, @Req() req: any): Promise<Message> {
      return this.service.createMessage(input, req)
      .then( val => { 
         this.ws.sendMessage(val)
          return val
        })
        .catch( err => {
            console.log(err)
            throw new BadRequestException(err)
        })
    }
    
}
