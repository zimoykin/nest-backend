import { Controller, Get, Req, Query, Post, Body } from '@nestjs/common';
import { FolderDto } from '../dto/folder.dto';
import { FolderService } from './folder.service';

@Controller('api/folder')
export class FolderController {

    constructor( private service: FolderService ) {}

    @Get()
    async getAll( @Req() req, @Query() query ) {
      return this.service.findAll( req.user, query ).then ( todos => {
        return todos.map ( (val) => {
          console.log (val)
          return this.service.toOutput( val )
        })
      })
    }

    @Post()
    async create ( @Req() req, @Body() input: FolderDto ) {
        let folder = await this.service.create(req.user, input)
        return this.service.toOutput( folder )
    }
}