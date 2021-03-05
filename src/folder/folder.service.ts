import { Injectable } from '@nestjs/common';
import { Folder } from '../model/folder.entity';
import { ModelService } from '../output/output.service';


@Injectable()
export class FolderService 
extends ModelService(Folder, Folder.relations) {}

