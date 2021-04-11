import {
  Controller,
    ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { createReadStream } from 'fs'
import { diskStorage } from 'multer'
import { FileService } from '../_SERVICES/file/file.service'
import { Stream } from 'stream'
import * as fs from 'fs'

@Controller('api/file')
export class FileController {
  constructor(private service: FileService) {}

  @Post(':holder')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/files',
        filename: (_, file, cb) => {
          cb(null, file.originalname)
        },
      }),
    })
  )
  async createFile(
    @Param('holder') param,
    @Req() req,
    @UploadedFile('file') file
  ): Promise<string> {
    return this.service.create(req.user, param, file.originalname)
  }

  @Get(':filename')
  @HttpCode(HttpStatus.OK)
  async sendFile(
    @Param('filename') filename: string,
    @Res() res,
    @Req() req
  ): Promise<Stream> {

    let file = await this.service.getFile(req.user, filename)
    if (!file) throw new ForbiddenException('')

    let path = `uploads/files/${file.title}`

    if (fs.existsSync(path)) {
        let fileStream = createReadStream(path)
        return fileStream.pipe(res)
    } else throw new NotFoundException('file not found')
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async list(@Req() req: any) {
      return this.service.getList(req.user)
  }

}
