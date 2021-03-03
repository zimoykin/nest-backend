import { UserOutputDto } from "./user.dto";

export interface TodoInputDto {
    title: string;
    description: string;
}

export interface TodoOutputDto {
    id: string;
    title: string;
    description: string;
    user: UserOutputDto;
    isDone: boolean;
}

export interface TodoUpdateDto {
    title?: string;
    description?: string;
}