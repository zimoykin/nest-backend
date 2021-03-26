import { Controller } from '@nestjs/common';
import { MessageService } from '../_SERVICES/message/message.service';
import { RestController } from './rest.controller';

@Controller('api/message')
export class MessageController  extends RestController(MessageService) {}
