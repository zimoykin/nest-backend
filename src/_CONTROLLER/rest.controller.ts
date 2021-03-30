import { Body, Delete, Get, Inject, Param, Patch, Post, Query, Req, Type, ValidationPipe } from "@nestjs/common";
import { Crud } from "src/_SERVICES/Crud.service";
import { Service } from "src/_SERVICES/DefaultService/default.service";

type Constructor<T> = new (...args: any[]) => T

export function RestController<T> (entity: Constructor<T>): Type<Crud<T>> {

  class Rest implements Crud<T> {

    @Inject(entity) 
    public service: Service<T>; 

    @Get(':id') read(@Param('id') id: string): Promise<T> {
      return this.service.read({ id: id })
    }
    @Get() readAll(@Query() query: any): Promise<T[]> {
        return this.service.readAll(query);
    }
    @Patch(':id') patch ( @Param('id') id: string, @Body() input: any ): Promise<T> {
      return this.service.update(id, input)
    }
    @Post() create (@Body( new ValidationPipe() ) input: any,  @Req() req: any): Promise<T> {
      return this.service.create(input, req.user)
    }
    @Delete(':id') delete (@Param('id') id: string): Promise<string> {
      return this.service.delete(id)
    }

  }

  return Rest;
}
