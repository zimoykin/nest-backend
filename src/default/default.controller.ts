import { Body, Controller, Get, Inject, Param, Post, Put, Req } from '@nestjs/common';
import { Createble, ModelService } from '../DefaultService/default.service';
import { Type } from '@nestjs/common';

export interface DefaultController<T,R extends Createble> {
  service: ModelService<T, R>
  read: (id: string) => Promise<T>;
  readAll: () => Promise<T[]>;
  update: (id: string, input:any) => Promise<T>;
  create: (input:R, req: Request) => Promise<T>;
}

type Constructor<R> = new (...args: any[]) => R

export function DefaultController<T, R extends Createble>(entity: Constructor<T>, path: string):Type<DefaultController<T,R>> {

  @Controller(`api/${path}`)
  class ControllerHost implements DefaultController<T,R> {

    @Inject(entity) 
    public service: ModelService<T,R>;

    @Get(':id') read(@Param('id') id: string): Promise<T> {
      return this.service.read({ id: id })
    }
    @Get() readAll(): Promise<T[]> {
        return this.service.readAll({});
    }
    @Put(':id') update(@Param('id') id: string, @Body() input: any ): Promise<T> {
      return this.service.update(id, input).then ( val => {
        return this.service.read({id: id})
      })
    }
    @Post() create (@Body() input: R,  @Req() req): Promise<T> {
      return this.service.create(input, req.user)
    }


  }

  return ControllerHost;
}
