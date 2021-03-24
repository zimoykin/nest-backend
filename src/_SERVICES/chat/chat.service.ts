import { HttpException, Injectable } from '@nestjs/common';
import { User } from '../../_MODEL/user.entity';
import { Chat } from '../../_MODEL/chat.entity';
import { ModelService, Owner } from '../DefaultService/default.service';

@Injectable()
export class ChatService extends ModelService(Chat, Chat.relations) {}