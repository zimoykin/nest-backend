import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, ValidationPipe } from '@nestjs/common';
import { ModelService } from '../../DefaultService/default.service';
import { Type } from '@nestjs/common';
import { Request } from 'express';
import { TodoInputDto } from 'src/dto/todo.dto';

export interface DefaultController<T,R> {
  protected: boolean
  service: ModelService<T, R>
  read: (id: string) => Promise<T>;
  readAll: () => Promise<T[]>;
  update: (id: string, input:any) => Promise<T>;
  create: (input:R, req: Request) => Promise<T>;
  delete: (id:string) => Promise<string>;
}

type Constructor<R> = new (...args: any[]) => R

export function DefaultController<T, R>(entity: Constructor<T>, path: string):Type<DefaultController<T,R>> {

  @Controller(`api/${path}`)
  class ControllerHost implements DefaultController<T,R> {

    protected: boolean = true;

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
    @Post() create (@Body( new ValidationPipe() ) input: R,  @Req() req: any): Promise<T> {
      return this.service.create(input, req.user)
    }
    @Delete(':id') delete (@Param('id') id: string): Promise<string> {
      return this.service.delete(id)
    }


  }

  return ControllerHost;
}
