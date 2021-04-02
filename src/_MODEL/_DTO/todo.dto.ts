import { Folder } from '../folder.entity'
import { FolderOutputDto } from './folder.dto'
import { UserOutputDto } from './user.dto'
import { IsBoolean, IsString } from 'class-validator'
import { CrudDto } from './crud.dto'

export class TodoInputDto implements CrudDto {
  @IsString()
  title: string
  @IsString()
  description: string
  @IsBoolean()
  isDone: boolean
  folder: Folder
}

export class TodoOutputDto {
  id: string
  title: string
  description: string
  user: UserOutputDto
  isDone: boolean
  folder: FolderOutputDto
}

export class TodoUpdateDto {
  @IsString()
  title?: string
  @IsString()
  description?: string
}
