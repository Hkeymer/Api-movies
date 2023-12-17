import { Controller, Get, Param, Delete } from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../../common/enums/rol.enum';
import { UsersService } from './users.service';

@Auth(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
