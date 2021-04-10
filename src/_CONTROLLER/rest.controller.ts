import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Type,
  ValidationPipe,
} from '@nestjs/common'
import { Crud } from '../_SERVICES/crud.service'
import { Service } from '../_SERVICES/DefaultService/default.service'

type Constructor<T> = new (...args: any[]) => T

export function RestController<T>(entity: Constructor<T>): Type<Crud<T>> {
  class Rest implements Crud<T> {
    @Inject(entity)
    public service: Service<T>

    @Get(':id') read(@Param('id') id: string): Promise<T> {
      return this.service.read({ id: id })
    }
    @Get() readAll(@Query() query: any): Promise<T[]> {
      return this.service.readAll(query)
    }
    @HttpCode(HttpStatus.OK)
    @Patch(':id') patch(
      @Param('id') id: string,
      @Body() input: any
    ): Promise<T> {
      return this.service.update(id, input)
    }
    @HttpCode(HttpStatus.OK)
    @Post() create(
      @Body(new ValidationPipe()) input: any,
      @Req() req: any
    ): Promise<T> {
      return this.service.create(input, req.user)
    }
    @HttpCode(HttpStatus.OK)
    @Delete(':id') delete(@Param('id') id: string): Promise<string> {
      return this.service.delete(id)
    }
  }

  return Rest
}
