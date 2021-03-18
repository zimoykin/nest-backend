import { Controller, UseGuards } from '@nestjs/common';
import { DefaultController } from '../Controllers/default/default.controller';
import { UsersService } from '../user/user.service';

@Controller('api/user')
export class UserProtectedController extends DefaultController(UsersService, 'user') {}
