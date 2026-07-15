import { Inject, Injectable } from '@nestjs/common';

import {
  UsersRepository,
  USERS_REPOSITORY,
} from '../../domain/repository/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly userRepo: UsersRepository,
  ) {}

  createUser(userData: any): any {
    return this.userRepo.create(userData);
  }
}
