import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { HttpException, Type } from '@nestjs/common';
import { User } from '../../_MODEL/user.entity';
import { ApiModel } from '../../_MODEL/apimodel';

export class Service <T> {
  repository: Repository<T>;
  read: (query: any) => Promise<T>;
  readRaw: (query: any) => Promise<T>;
  readAll: (query: any) => Promise<T[]>;
  update: (id: string, input: any | any) => Promise<T>;
  create: (input: any, user: User) => Promise<T>;
  delete: (id: string) => Promise<any>;
}
 
type Constructor<I> = new (...args: any[]) => I;

export function ModelService<T extends ApiModel> (entity: Constructor<T>, relations: string[]): Type<Service<T>> {
  
  class DataServiceHost implements Service<T> {

    @InjectRepository(entity)
    public repository: Repository<T>;

    public async read(query: any): Promise<T> {
      try {
        return (
          await this.repository.findOne({ where: query, relations: relations })
        ).output();
      } catch (err) {
        return err;
      }
    }

    public async readAll(query: any): Promise<T[]> {
      return (
        await this.repository.find({ where: query, relations: relations })
      ).map((val) => {
        return val.output();
      });
    }

    public async readRaw(query: any): Promise<T> {
      return this.repository.findOne({ where: query });
    }

    public async update(id: string, input: any): Promise<T> {
      return this.repository.update(id, input).then( () => {
        return this.repository.findOne(id, { relations: relations}).then ( val => {
          return val.shortoutput()
        })
      });
    }
    

    public async create(input: any, user: User): Promise<T> {
      try {
        let data = await this.repository
          .createQueryBuilder()
          .insert()
          .values(input)
          .execute()
          .then(async (val) => {
            let model = await this.readRaw(val.identifiers);
            if (model.hasOwner) {
              let owner: Owner = {
                user: user,
              };
              await this.update(model.id, owner);
              return await this.read(val.identifiers);
            } else {
              return this.read(val.identifiers);
            }
          });
        return data;
      } catch (err) {
        throw new HttpException(err.message, 400);
      }
    }

    public async delete (id: string): Promise<any> {
      return this.repository.delete(id).then( () => {
        return { deleted: id }
      })
    }

  }

  return DataServiceHost;
}

export interface Owner {
  user: User;
}



