import { Controller, Get, Post } from '@nestjs/common';

@Controller('')
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
