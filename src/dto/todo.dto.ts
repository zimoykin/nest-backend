import { FolderOutputDto } from "./folder.dto";
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
    folder: FolderOutputDto;
}

export interface TodoUpdateDto {
    title?: string;
    description?: string;
}