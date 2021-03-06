import { Controller } from '@nestjs/common';
import { DefaultController } from '../default/default.controller';
import { UsersService } from './user.service';

@Controller('api/user')
export class UserProtectedController extends DefaultController(UsersService, 'user') { }
