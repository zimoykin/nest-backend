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
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Stream } from 'stream'

@Controller('api/file')
export class FileController {
    
  @Post()
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
  async createFile(@Req() req, @UploadedFile('file') file): Promise<string> {
    return 'done!'
  }

  @Get(':filename')
  @HttpCode(HttpStatus.OK)
  async sendFile(@Param('filename') filename: string, @Res() res): Promise<Stream> {
    let fileStream = createReadStream(`uploads/files/${filename}`)
    //res.contentType('application/jpg');
    return fileStream.pipe(res)
  }

}
