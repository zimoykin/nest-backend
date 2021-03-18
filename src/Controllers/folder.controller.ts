import { Controller } from '@nestjs/common';
import { DefaultController } from '../Controllers/default/default.controller';
import { FolderService } from '../folder/folder.service';


@Controller('api/folder')
export class FolderController 
extends DefaultController(FolderService, 'folder') { }
