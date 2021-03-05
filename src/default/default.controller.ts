import { Controller, Get, Inject, Injectable, Param } from '@nestjs/common';
import { ModelService, Outputable } from '../output/output.service';
import { Type } from '@nestjs/common';

export interface Controller<T> {
  read: (id: string) => Promise<T>;
  readAll: () => Promise<T[]>;
}

type Constructor<I> = new (...args: any[]) => I 

export function DefaultController<T extends Outputable<T>>(entity: Constructor<T>, path: string): Type<Controller<T>> {

  @Controller(`api/${path}`)
  class DataServiceHost implements Controller<T> {

    private service: ModelService<T>;

    @Get(':id') read(@Param('id') id: string): Promise<T> {
      return this.service.read({ id: id });
    }
    @Get() readAll(): Promise<T[]> {
        return this.service.readAll({});
    }

  }

  return DataServiceHost;
}
