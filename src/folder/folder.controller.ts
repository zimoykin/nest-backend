import { Controller } from '@nestjs/common';
import { DefaultController } from '../default/default.controller';
import { FolderService } from './folder.service';


@Controller('api/folder')
export class FolderController 
extends DefaultController(FolderService, 'folder') { }
