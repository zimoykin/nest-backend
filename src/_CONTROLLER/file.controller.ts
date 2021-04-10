import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
    @Res() res
  ): Promise<Stream> {
    let fileStream = createReadStream(`uploads/files/${filename}`)
    //res.contentType('application/jpg');
    return fileStream.pipe(res)
  }
}
