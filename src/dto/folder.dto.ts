import { Todo } from "../model/todo.entity";
import { TodoOutputDto } from "./todo.dto";
import { UserOutputDto } from "./user.dto";


export interface FolderDto {
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
    title?: string;
    description?: string;
    todos?: number;
}