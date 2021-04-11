import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { UsersService } from '../_SERVICES/user/user.service'
import { RestController } from './rest.controller'

@Controller('api/user')
export class UserProtectedController extends RestController(UsersService) {
  constructor(public service: UsersService) {
    super()
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/photos',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
    })
  )
  async upload(@UploadedFile() file, @Req() req: any) {
    return this.service
      .update(req.user.id, { photo: file.filename })
      .then((res) => {
        return { created: res }
      })
      .catch((err) => {
        console.log(err)
        throw new BadRequestException(err.message)
      })
  }
}
