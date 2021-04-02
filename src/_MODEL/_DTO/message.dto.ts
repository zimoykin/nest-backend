import { IsString } from 'class-validator'
import { MessageType } from '../../_UTILS/enums/MessageType'
import { CrudDto } from './crud.dto'

export class MessageDTO implements CrudDto {
  @IsString()
  chatid: string
  @IsString()
  message: string
  @IsString()
  type: MessageType
}
