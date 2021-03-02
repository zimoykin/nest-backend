import { UserOutputDto } from "./user.dto";

export interface TodoInputDto {
    title: string;
    description: string;
}

export interface TodoOutputDto {
    title: string;
    description: string;
    user: UserOutputDto;
    isDone: boolean;
}

