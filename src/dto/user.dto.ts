import { User } from "../model/user.entity";
import { sign as jwt } from "jsonwebtoken";

export interface UserInputDto {
    username: string;
    email: string;
    password: string;
}

export interface UserOutputDto {
  username: string;
  email: string;
  id: string;
  todos: number;
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