import { Createble } from "../DefaultService/default.service";
import { UserOutputDto } from "./user.dto";

export interface FolderDto extends Createble {
    title: string;
    description: string;
}

export interface FolderFullDto {
    id: string;
    title: string;
    description: string;
    user: UserOutputDto;
    todos: any[];
}

export interface FolderOutputDto {
    id: string;
    title: string;
    description: string;
    todos: number;
}