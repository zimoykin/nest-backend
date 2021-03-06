import { Injectable } from '@nestjs/common';
import { Folder } from '../model/folder.entity';
import { ModelService } from '../DefaultService/default.service';


@Injectable()
export class FolderService 
extends ModelService(Folder, Folder.relations) {}

