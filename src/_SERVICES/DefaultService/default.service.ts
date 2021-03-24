import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  delete: (id: string) => Promise<string>;
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
      return this.repository.update(id, input).then((updated) => {
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

    public async delete (id: string): Promise<string> {
      return this.repository.delete(id).then( val => {
        return id
      })
    }

  }

  return DataServiceHost;
}

export interface Owner {
  user: User;
}




// interface Crud<T extends Model> {
//   repository: Repository<T>
//   getOne: () => T
//   getAll: () => T
//   create: () => T
//   delete: () => T
//   patch: () => T

// }
// class Repository<T extends Model> {
//   howItIsGoing(some: T): T {
//       console.log('im OK ' + some.name)
//       return some;
//   }
// }

/////////////

// class RestController<T extends Model> implements Crud<T> {

//   repository = new Repository<T>()
//   model: T
  
//   constructor (some: T) {
//       this.model = some
//   }

//   getOne(): T {
//       return this.repository.howItIsGoing(this.model)
//   }
//   create(): T {
//       return this.repository.howItIsGoing(this.model)
//   }
//   delete(): T {
//       return this.repository.howItIsGoing(this.model)
//   }
//   getAll(): T {
//       return this.repository.howItIsGoing(this.model)
//   }
//   patch(): T {
//       return this.repository.howItIsGoing(this.model)
//   }


// }

// class Model {
//   name: string
//   constructor (name: string) {
//       this.name = name
//   }
// }

// class Robot implements Model{
//   name: string;
//   constructor (name: string) {
//       this.name = name
//   }
// }

// class RobotController extends RestController<Robot> {}

// class PersonController extends RestController<Person> {
//   create(): Person{
//        console.log('override this')
//       return this.repository.howItIsGoing(this.model) 
//   }
// }

// let robot = new Robot('Robot')
// let controller = new RobotController(robot)

// controller.create()


// class Person implements Model{
//   name: string;
//   constructor (name: string) {
//       this.name = name
//   }
// }

// let mary = new Person('mary')
// let maryController = new PersonController(mary)

// maryController.create()