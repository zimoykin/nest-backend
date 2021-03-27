import { IsString } from "class-validator"
import { MessageType } from "../../_UTILS/enums/MessageType"

export class MessageDTO {
    
    @IsString()
    chatid: string
    @IsString()
    message: string
    @IsString()
    type: MessageType

}