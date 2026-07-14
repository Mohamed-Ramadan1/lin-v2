import { Controller, Get } from '@nestjs/common';

@Controller('')
export class UsersController {
  @Get()
  getUsers() {
    return {
      message: 'helllo',
    };
  }
}
