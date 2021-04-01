import { IsString } from 'class-validator'
import { MessageType } from '../../_UTILS/enums/MessageType'

export class SocketMessage {
  @IsString()
  chatid: string
  @IsString()
  user: string
  @IsString()
  message: string
  @IsString()
  type: MessageType
}
