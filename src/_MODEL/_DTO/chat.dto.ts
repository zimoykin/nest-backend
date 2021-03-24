import { IsString } from "class-validator";
import { UserOutputDto } from "./user.dto";



export class ChatDto {
    @IsString()
    title: string;
    users: string[]
}

export interface ChatOutputDto {
    id: string;
    title: string;
    users: UserOutputDto
}