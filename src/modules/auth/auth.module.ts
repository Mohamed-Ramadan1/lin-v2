import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthService } from './application/services/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { UsersModule } from '@modules/users/users.module';

import { InfrastructureModule } from '@infrastructure/infrastructure.module';

@Module({
  imports: [PassportModule, UsersModule, InfrastructureModule],
  providers: [
    JwtStrategy,
    AuthService,
    {
      provide: 'REFRESH_TOKEN_KEY_PREFIX',
      useValue: 'refresh_token',
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
