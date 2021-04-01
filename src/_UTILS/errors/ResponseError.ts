import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { NetwortError } from '../enums/networkError'

export const ServerError = (
  type: NetwortError,
  reason = 'something went wrong'
): Error => {
  switch (type) {
    case NetwortError.badRequest:
      return new BadRequestException(`${reason}`)
    case NetwortError.intenal:
      return new InternalServerErrorException(`${reason}`)
    case NetwortError.unauthorized:
      return new UnauthorizedException(`${reason}`)
    default:
      break
  }
}
