import { Controller } from '@nestjs/common';
import { UsersService } from '../_SERVICES/user/user.service';
import { RestController } from './rest.controller';

@Controller('api/user')
export class UserProtectedController extends RestController(UsersService) {}
