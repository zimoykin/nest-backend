import { Folder } from "../model/folder.entity";
import { Createble } from "../DefaultService/default.service";
import { FolderOutputDto } from "./folder.dto";
import { UserOutputDto } from "./user.dto";

export interface TodoInputDto extends Createble {
    title: string;
    description: string;
    isDone: boolean;
    folder: Folder
}

export interface TodoOutputDto extends Createble {
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