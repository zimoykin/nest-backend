import { User } from "src/model/user.entity"

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

// export const userOutput = ( user: User ) : UserOutputDto => {
//   let user_dto: UserOutputDto = user
//   //username: user.username, email: user.email, id: user.id
//   return user_dto
// }