import { Controller, Get, Req, Query, Post, Body } from '@nestjs/common';
import { Folder } from '../model/folder.entity';
import { DefaultController } from '../default/default.controller';


@Controller('api/folder')
export class FolderController extends DefaultController<Folder>(Folder,'folder') { }
