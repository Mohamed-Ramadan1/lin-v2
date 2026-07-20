import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthService } from './application/services/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [PassportModule, UsersModule],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
