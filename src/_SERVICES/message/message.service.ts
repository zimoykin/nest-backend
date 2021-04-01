import { Injectable } from '@nestjs/common'
import { MessageDTO } from '../../_MODEL/_DTO/message.dto'
import { getRepository } from 'typeorm'
import { Message } from '../../_MODEL/message.entity'
import { ModelService } from '../DefaultService/default.service'
import { Chat } from '../../_MODEL/chat.entity'

@Injectable()
export class MessageService extends ModelService(Message, Message.relations) {
  public async createMessage(input: MessageDTO, req: any): Promise<Message> {
    const repo = getRepository(Message)

    const message = new Message()
    message.message = input.message
    message.user = req.user

    message.chat = await getRepository(Chat).findOne(input.chatid)

    return repo.save(message).then((val) => {
      return this.read({ id: val.id })
    })
  }
}
