import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../_MODEL/user.entity'
import { Brackets, getRepository } from 'typeorm'
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
  getList(user: User):Promise<File[]> {
     return this.repository.find({where: {user: user}, relations: File.relations})
     .then( vals => vals.map (val => val.output()))
  }
  async getFile(user:User, filename: string): Promise<File> {
      return this.repository
      .createQueryBuilder('file')
      .leftJoin('file.holder', 'meet')
      .leftJoin('meet.members', 'users')
      .where( new Brackets (qb =>{
        qb.where('users.id = :userId', { userId: user.id })
        qb.orWhere('file.user_id = :userId', { userId: user.id })
      }))
      .andWhere('file.title = :filename', {filename: filename})
      .getOne()
  }
}
