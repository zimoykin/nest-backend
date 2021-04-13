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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Repository } from 'typeorm'
import { Crud } from '../_SERVICES/crud.service'
import { Service } from '../_SERVICES/DefaultService/default.service'

type Constructor<T> = new (...args: any[]) => T

export function RestController<T>(entity: Constructor<T>): Type<Crud<T>> {

  @ApiTags('rest api')
  class Rest implements Crud<T> {
    @Inject(entity)
    public service: Service<T>

    @ApiBearerAuth()
    @ApiOperation({ summary: 'get one of' + entity.name})
    @ApiParam(ApiParam({name: 'string'}))
    @ApiResponse({ status: 200, description: 'a ' + entity.name})
    @Get(':id') read(@Param('id') id: string): Promise<T> {
      return this.service.read({ id: id })
    }
    @ApiBearerAuth()
    @ApiOperation({ summary: 'get array of ' + entity.name})
    @ApiResponse({ status: 200, description: 'array of ' + entity.name})
    @Get() readAll(@Query() query: any): Promise<T[]> {
      return this.service.readAll(query)
    }
    @ApiBearerAuth()
    @ApiOperation({ summary: 'update ' + entity.name})
    @ApiResponse({ status: 200, description: 'update ' + entity.name})
    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    patch(@Param('id') id: string, @Body() input: any): Promise<T> {
      return this.service.update(id, input)
    }
    @ApiBearerAuth()
    @ApiOperation({ summary: 'create ' + entity.name })
    @ApiResponse({ status: 200, description: 'create ' + entity.name})
    @HttpCode(HttpStatus.OK)
    @Post()
    create(
      @Body(new ValidationPipe()) input: any,
      @Req() req: any
    ): Promise<T> {
      return this.service.create(input, req.user)
    }
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    delete(@Param('id') id: string): Promise<string> {
      return this.service.delete(id)
    }
  }

  return Rest
}
