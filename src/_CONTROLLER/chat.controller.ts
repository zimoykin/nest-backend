import { Body, Controller, Post, Req } from '@nestjs/common';
import { ChatService } from '../_SERVICES/chat/chat.service';
import { RestController } from './rest.controller';
import { ChatDto } from '../_MODEL/_DTO/chat.dto';


@Controller('api/chat')
export class ChatController extends RestController(ChatService) {

  constructor(public service: ChatService) {
    super();
  }

  @Post('/start')
  startChat(@Body() input: ChatDto, @Req() req: any): Promise<string> {
    let find = new Promise<string>((resolve, reject) => {
        if ( input.users.filter( val => { return val === req.user.id}).length == 0 ) {
            reject('could not created')
        }


      if (input.users.length > 0) {
        this.service.repository
          .query(
            `SELECT chatmembers.chatid,
                            COUNT(chatmembers.user_id)
                        FROM
                            chatmembers
                        WHERE
                            user_id IN ( ${input.users.map( val => { return "'" + val + "'" })} )
                        GROUP BY chatmembers.chatid
                    `,
          )
          .then((result) => {
            if (result.length > 0 && result[0].count == input.users.length) {
              resolve(result[0].chatid);
            } else {
            
              this.service.create( input, req.user).then ( (val) => {  
                resolve ((val as any))
              })

            }
          });
      } else {
        reject();
      }
    });

    return find;
  }
}
