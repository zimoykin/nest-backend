import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as DataLoader from 'dataloader';
import { Type } from '@nestjs/common'

export interface ModelService<T> {
  repository: Repository<T>
  read: (query: any) => Promise<T>
  readRaw: (query: any) => Promise<T>
  readAll: (query: any) => Promise<T[]>
  update: (id:string, input:any) => Promise<T>
  create: (input:any) => Promise<T[]>
}

export interface Outputable <T> {
  output: () => Promise<T>
}

export class Model<T extends Outputable<T>> {
  output: () => Promise<T>
}

type Constructor<I> = new (...args: any[]) => I 

export function ModelService<T extends Outputable<T>>(entity: Constructor<T>, relations: string[]):Type<ModelService<T>> {

  class DataServiceHost implements ModelService<T> {

    @InjectRepository(entity) 
    public repository: Repository<T>;

    public async read(query: any): Promise<T> {
      return (await this.repository.findOne( {where: query, relations: relations} )).output()
    }

    public async readAll(query: any): Promise<T[]> {
      let data = await this.repository.find( {where: query, relations: relations} )
      data.map ( val => {
        return val.output()
      })
      return data
    }

    public async readRaw(query: any): Promise<T> {
      return this.repository.findOne({where: query})
    }

    public async update (id:string, input: any) : Promise<T> {
      return this.repository.update(id, input).then( _ => {
        return this.read({id: id})
      })
    }

    public async create (input: any): Promise<T[]> {
      let model: T[] = this.repository.create(input)
      // model.map( (val:T) => {
      //   this.repository.save(val)
      // })

      return model
    }

  }

  return DataServiceHost
}