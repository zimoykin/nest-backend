import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from '@nestjs/common'
import { User } from '../model/user.entity';


export interface ModelService<T,R> {
  repository: Repository<T>
  read: (query: any) => Promise<T>
  readRaw: (query: any) => Promise<T>
  readAll: (query: any) => Promise<T[]>
  update: (id:string, input:R | any) => Promise<T>
  create: (input:R, user: User) => Promise<T>
}

export interface Model <T, R extends Createble> {

  id: string;
  inputDTO: R;
  hasOwner: boolean

  output: () => T
  shortoutput: () => T
}
export interface Createble {

}
export interface Outputable {

}

type Constructor<I> = new (...args: any[]) => I 

export function ModelService<T extends Model<T,R>,R>(entity: Constructor<T>, relations: string[]): Type<ModelService<T,R>> {

  class DataServiceHost implements ModelService<T,R> {

    @InjectRepository(entity) 
    public repository: Repository<T>;

    public async read(query: any): Promise<T> {
      try {
        return (await this.repository.findOne( {where: query, relations: relations} )).output()
      } catch (err) {
        return err
      }
      
    }

    public async readAll(query: any) : Promise<T[]> {
      return (await this.repository.find({where: query, relations: relations}))
      .map ( val => {
        return val.output()
      })
    }

    public async readRaw(query: any): Promise<T> {
      return this.repository.findOne({where: query})
    }

    public async update (id:string, input: R | any ) : Promise<T> {
      return this.repository.update(id, input).then( updated => {
        return this.read({id: id}).then( async val => {
            return await val
          })
      })
    }

    public async create (input: R, user: User) : Promise<T> {
     
      let data = await this.repository
      .createQueryBuilder()
      .insert().values( input ).execute()
      .then ( async val => {
        let model = await this.readRaw(val.identifiers)
        if (model.hasOwner) { 
          let owner: Owner = {
            user: user
          }
          await this.update( model.id, owner)
          return await this.read(val.identifiers)
        } else {
          return this.read(val.identifiers)
        }
      })
      return data
    }

  }

  return DataServiceHost
}


export interface Owner extends Createble {
  user: User
}