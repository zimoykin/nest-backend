import { Injectable } from '@nestjs/common';
import { Message } from '../../_MODEL/message.entity';
import { ModelService } from '../DefaultService/default.service';

@Injectable()
export class MessageService 
extends ModelService(Message, Message.relations){}
