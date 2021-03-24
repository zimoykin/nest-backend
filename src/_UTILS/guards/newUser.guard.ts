import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { StringValueNode } from 'graphql';
import { Observable } from 'rxjs';
import { UserInputDto } from '../../_MODEL/_DTO/user.dto';

@Injectable()
export class NewUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request: Request = context.switchToHttp().getRequest();
    //something
    return true
  }
}