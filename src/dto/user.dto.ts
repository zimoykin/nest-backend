import { User } from "../model/user.entity";
import { sign as jwt } from "jsonwebtoken";
import { FolderOutputDto } from "./folder.dto";
import { Createble } from "../DefaultService/default.service";


export interface UserInputDto extends Createble {
    username: string;
    email: string;
    password: string;
}

export interface UserOutputDto {
    username: string;
    email: string;
    id: string;
    folder: FolderOutputDto[];
}

export interface UserSearchDto {
  username?: string;
  email?: string;
}

export interface UserAccess {
  id: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserRefreshToken {
  refreshToken: string;
}


export const getAccess = (user: string): UserAccess => {
  const jwt_secret = process.env.JWTSECRET;

  let accessToken = jwt({ id: user }, jwt_secret, { expiresIn: "1h" });
  let refreshToken = jwt({ id: user }, jwt_secret, { expiresIn: "24h" });

  return { id: user, accessToken: accessToken, refreshToken: refreshToken };
};

// export const userOutput = ( user: User ) : UserOutputDto => {
//   let user_dto: UserOutputDto = user
//   //username: user.username, email: user.email, id: user.id
//   return user_dto
// }