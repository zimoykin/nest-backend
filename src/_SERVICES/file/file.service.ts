import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../_MODEL/user.entity'
import { Brackets, getRepository } from 'typeorm'
import { File } from '../../_MODEL/file.entity'
import { extname } from 'path'
import * as fs from 'fs'

@Injectable()
export class FileService {
  @InjectRepository(File) repository = getRepository(File)

  async create(user: User, holder: string, filename: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const file = await this.repository.findOne({
        where: { holder: holder, title: filename },
      })
      if (file)
        reject(new ConflictException('this file was uploaded in the past.'))
      const new_file = this.repository.create({
        title: filename,
        holder: holder,
        user: user,
        extension: extname(filename),
      })
      this.repository
        .save(new_file)
        .then((val) => resolve(val.id))
        .catch((err) => reject(err))
    })
  }
  getList(user: User): Promise<File[]> {
    return this.repository
      .find({ where: { user: user }, relations: File.relations })
      .then((vals) => vals.map((val) => val.output()))
  }
  async getFile(user: User, filename: string): Promise<File> {
    return this.repository
      .createQueryBuilder('file')
      .leftJoin('file.holder', 'meet')
      .leftJoin('meet.members', 'users')
      .where(
        new Brackets((qb) => {
          qb.where('users.id = :userId', { userId: user.id })
          qb.orWhere('file.user_id = :userId', { userId: user.id })
        })
      )
      .andWhere('file.title = :filename', { filename: filename })
      .getOne()
  }
  async delete(id: string, user: User) {
    return this.repository
      .findOne(id, {
        where: {
          user: user,
        },
      })
      .then((file) => {
        if (!file) throw new NotFoundException()
        return this.repository
          .delete(file.id)
          .then(() => {
            const oldpath = `uploads/files/${file.title}`
            const newpath = `uploads/deleted/${file.title}`

            fs.rename(oldpath, newpath, () => {
              console.log(`file move to deleted: ${file.title}`)
            })
            return { deleted: file.id }
          })
          .catch((err) => {
            console.log(err)
            throw new InternalServerErrorException(err.message)
          })
      })
      .catch((err) => {
        console.log(err)
        throw new NotFoundException(err.message)
      })
  }
}
