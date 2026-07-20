import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { UsersController } from './presentation/controller/users.controller';
import { UsersService } from './application/services/users.service';
import { UsersRepositoryService } from './infrastructure/repositories/users.repository.service';
import { USERS_REPOSITORY } from './domain/repository/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  exports: [USERS_REPOSITORY],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepositoryService,
    },
  ],
})
export class UsersModule {}
