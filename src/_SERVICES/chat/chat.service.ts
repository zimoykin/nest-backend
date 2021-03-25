import { HttpException, Injectable } from '@nestjs/common';
import { User } from '../../_MODEL/user.entity';
import { Chat } from '../../_MODEL/chat.entity';
import { ModelService, Owner } from '../DefaultService/default.service';
import { getRepository, In } from 'typeorm';
import { ChatDto } from '../../_MODEL/_DTO/chat.dto';

@Injectable()
export class ChatService extends ModelService(Chat, Chat.relations) {

    public async getChat (req: any): Promise<Chat[]> {

        let repo = getRepository(Chat)

        return repo.createQueryBuilder('chat')
        .distinct(true)
        .innerJoin('chat.users', 'user', 'user.id IN (:...ids)', { ids: [req.user.id] })
        .innerJoinAndSelect('chat.users', 'users')
        .innerJoinAndSelect('chat.admin', 'admin')
        .orderBy('chat.lastChangedDateTime')
        .getMany()
        .then( chats => {   
            return chats.map( chat => {
                return chat.output()
                }
            )}
        )

    }

    public async updateChat(id: string, input: ChatDto): Promise<Chat> {

        return getRepository(Chat).update(id, {title: input.title}).then( () => {

            return this.repository.findOne(id, { relations: Chat.relations })
            .then( async val => {
                getRepository(User).find({
                    where: {id: In(input.users)}
                })
                .then( users => {
                    val.users = users   
               })
                await getRepository(Chat).save(val)
                return this.read({id:id})
            })
        })
    }

    public async createChat (input: ChatDto, req: any): Promise<Chat> {

        let repo = getRepository(Chat)

        let chat = new Chat()
        chat.title = input.title
        chat.settings = input.settings
        chat.admin = req.user
        if (input.title === '') {
            chat.title = input.users.join(',')
        } 
       
        chat.users = await ChatDto.getUsers(input.users)

        return repo.save(chat).then( val => {
            return this.read({id: val.id})
        })
    
    }
      

}