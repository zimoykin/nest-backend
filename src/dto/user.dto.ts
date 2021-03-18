import { sign as jwt } from "jsonwebtoken";
import { FolderOutputDto } from "./folder.dto";
import { Type } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserInputDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserOutputDto {
    username: string;
    email: string;
    id: string;
    folder: FolderOutputDto[];
}

export class UserSearchDto {
  @IsString()
  username?: string;
  @IsString()
  @IsEmail()
  email?: string;
}

export interface UserAccess {
  id: string;
  accessToken: string;
  refreshToken: string;
}

export class UserRefreshToken {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}


export const getAccess = (user: string): UserAccess => {
  const jwt_secret = process.env.JWTSECRET;

  let accessToken = jwt({ id: user }, jwt_secret, { expiresIn: "1h" });
  let refreshToken = jwt({ id: user }, jwt_secret, { expiresIn: "24h" });

  return { id: user, accessToken: accessToken, refreshToken: refreshToken };
};



export interface ArgumentMetadata<T> {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<Type>;
  data?: string;
}