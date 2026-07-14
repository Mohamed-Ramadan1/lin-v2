import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@nestjs/core';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    RouterModule.register([
      { path: 'users', module: UsersModule },
      { path: 'auth', module: AuthModule },
    ]),
    CoreModule,
    InfrastructureModule,
    HealthModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
