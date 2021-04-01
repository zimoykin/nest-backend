import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { ChatService } from '../_SERVICES/chat/chat.service'
import { RestController } from './rest.controller'
import { ChatDto } from '../_MODEL/_DTO/chat.dto'
import { ValidationPipe } from '../_UTILS/validate.pipe'
import { Chat } from '../_MODEL/chat.entity'

@Controller('api/chat')
export class ChatController extends RestController(ChatService) {
  constructor(public service: ChatService) {
    super()
  }

  @Get('')
  getChat(@Req() req: any): Promise<Chat[]> {
    return this.service.getChat(req)
  }

  @Post('')
  createChat(
    @Body(new ValidationPipe()) input: ChatDto,
    @Req() req: any
  ): Promise<Chat> {
    return this.service.createChat(input, req)
  }

  @Patch(':id') patchChat(
    @Param('id') id: string,
    @Body() input: any
  ): Promise<Chat> {
    return this.service.updateChat(id, input)
  }
}
