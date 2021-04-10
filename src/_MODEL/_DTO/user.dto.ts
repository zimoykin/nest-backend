import { sign as jwt } from 'jsonwebtoken'
import { FolderOutputDto } from './folder.dto'
import {
  IsEmail,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator'
import { User } from '../user.entity'
import { getRepository, In } from 'typeorm'
import { Gender } from '../../_UTILS/enums/genders'
import { Roles } from '../../_UTILS/enums/roles'

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsLowercase()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string

  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string

  @IsString()
  @IsNotEmpty()
  @IsEnum(Roles)
  role: string

  static async getUsers(ids: string[]): Promise<User[]> {
    return getRepository(User).find({
      where: { id: In(ids) },
    })
  }
}

export interface CacheUser {
  accept: AcceptToken
  payload: UserDto
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
export class AcceptToken {
  @IsString()
  @IsNotEmpty()
  email: string
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
