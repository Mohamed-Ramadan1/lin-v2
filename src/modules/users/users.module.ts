import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { UsersController } from './presentation/controller/users.controller';
import { UsersService } from './application/services/users.service';
import { UsersRepositoryService } from './infrastructure/repositories/users.repository.service';
import { UsersRepository } from './domain/repository/users.repository';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  exports: [UsersRepository],
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useClass: UsersRepositoryService,
    },
  ],
})
export class UsersModule {}
