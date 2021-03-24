import { Controller } from '@nestjs/common';
import { FolderService } from '../_SERVICES/folder/folder.service';
import { RestController } from './rest.controller';


@Controller('api/folder')
export class FolderController 
extends RestController(FolderService) { }
