import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { configureApplication } from './core/bootstrap/app.bootstrap';
import { toBoolean, toNumber } from './core/config/env.utils';
import { setupSwagger } from './core/swagger/swagger.config';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  configureApplication(app);

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  const enableSwagger = toBoolean(
    configService.get('ENABLE_SWAGGER'),
    nodeEnv !== 'production',
  );
  if (enableSwagger) {
    setupSwagger(app);
  }

  await app.listen(toNumber(process.env.PORT, 3000));
}
void bootstrap();
