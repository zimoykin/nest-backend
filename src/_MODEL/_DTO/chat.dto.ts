import { IsString } from 'class-validator'
import { getRepository, In } from 'typeorm'
import { User } from '../user.entity'
import { UserOutputDto } from './user.dto'

export class ChatDto {
  @IsString() title: string
  settings: any
  users?: string[]

  static async getUsers(ids: string[]): Promise<User[]> {
    return getRepository(User).find({
      where: { id: In(ids) },
    })
  }
}

export interface ChatOutputDto {
  id: string
  title: string
  users: UserOutputDto
}
