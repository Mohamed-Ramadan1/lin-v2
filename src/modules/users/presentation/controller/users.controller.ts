import { Controller, Get, Post, UseGuards } from '@nestjs/common';

// Common module  imports
import {
  AuthGuard,
  RolesGuard,
  Roles,
  UserRole,
  Protected,
} from '@common/index';

@Controller('')
@Protected()
@UseGuards(AuthGuard, RolesGuard)
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
