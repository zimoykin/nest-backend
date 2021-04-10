import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../_MODEL/user.entity'
import { getRepository } from 'typeorm'
import { File } from '../../_MODEL/file.entity'
import { extname } from 'path'

@Injectable()
export class FileService {
  @InjectRepository(File) repository = getRepository(File)

  async create(user: User, holder: string, filename: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let file = await this.repository.findOne({
        where: { holder: holder, title: filename },
      })
      if (file)
        reject(new ConflictException('this file was uploaded in the past.'))
      let new_file = this.repository.create({
        title: filename,
        holder: holder,
        user: user,
        extension: extname(filename)
      })
      this.repository
        .save(new_file)
        .then((val) => resolve(val.id))
        .catch((err) => reject(err))
    })
  }
}
