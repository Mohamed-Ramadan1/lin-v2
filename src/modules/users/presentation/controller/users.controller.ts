import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { UserRole } from '@common/enums/user-role.enum';

@Controller('')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  @Get()
  getUsers() {
    return 'List of users';
  }

  @Get(':id')
  getUserById() {
    return 'User details';
  }

  @Post()
  createUser() {
    return 'User created successfully';
  }
}
