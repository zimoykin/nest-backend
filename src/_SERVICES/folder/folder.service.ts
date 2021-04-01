import { Injectable } from '@nestjs/common'
import { Folder } from '../../_MODEL/folder.entity'
import { ModelService } from '../DefaultService/default.service'

@Injectable()
export class FolderService extends ModelService(Folder, Folder.relations) {}
