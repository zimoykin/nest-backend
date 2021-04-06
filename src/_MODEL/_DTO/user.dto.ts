import { sign as jwt } from 'jsonwebtoken'
import { FolderOutputDto } from './folder.dto'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { User } from '../user.entity'
import { CrudDto } from './crud.dto'
import { getRepository, In } from 'typeorm'

export class UserDto implements CrudDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsString()
  @IsNotEmpty()
  gender: string

  @IsString()
  @IsNotEmpty()
  role: string

  static async getUsers(ids: string[]): Promise<User[]> {
    return getRepository(User).find({
      where: { id: In(ids) },
    })
  }
}

export class UserOutputDto {
  username: string
  email: string
  id: string
  folder: FolderOutputDto[]

  public static output(user: User): UserOutputDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      folder: user.folders.map((val) => {
        return val.shortoutput()
      }),
    }
  }
}

export class UserSearchDto {
  @IsString()
  username?: string
  @IsString()
  @IsEmail()
  email?: string
}

export interface UserAccess {
  id: string
  accessToken: string
  refreshToken: string
}
export class AcceptToken implements CrudDto {
  @IsString()
  @IsNotEmpty()
  id: string
  @IsString()
  @IsNotEmpty()
  acceptToken: string
}

export class UserRefreshToken {
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}

export const getAccess = (user: string): UserAccess => {
  const jwt_secret = process.env.JWTSECRET

  const accessToken = jwt({ id: user }, jwt_secret, { expiresIn: '1h' })
  const refreshToken = jwt({ id: user }, jwt_secret, { expiresIn: '24h' })

  return { id: user, accessToken: accessToken, refreshToken: refreshToken }
}
