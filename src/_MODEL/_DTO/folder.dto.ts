import { IsString } from 'class-validator'
import { CrudDto } from './crud.dto'
import { UserOutputDto } from './user.dto'

export class FolderDto implements CrudDto {
  @IsString()
  title: string
  @IsString()
  description: string
}

export interface FolderFullDto {
  id: string
  title: string
  description: string
  user: UserOutputDto
  todos: any[]
}

export interface FolderOutputDto {
  id: string
  title: string
  description: string
  todos: number
}
