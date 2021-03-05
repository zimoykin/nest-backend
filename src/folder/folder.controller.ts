import { Controller, Get, Req, Query, Post, Body } from '@nestjs/common';
import { FolderDto } from '../dto/folder.dto';
import { FolderService } from './folder.service';

@Controller('api/folder')
export class FolderController {

    constructor( private service: FolderService ) {}

    @Get()
    async getAll( @Req() req, @Query() query ) {
      return this.service.readAll( {user: req.user} )
    }

}