import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { bold } from 'colorette';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { ISecretsService } from 'libs/modules/global/secrets/adapter';
import { SecretsService } from 'libs/modules/global/secrets/service';
import { RpcExceptionFilter } from 'libs/utils/filters/rpc-exception.filter';
import { RpcExceptionInterceptor } from 'libs/utils/interceptors/exception/rpc-exception.interceptor';
import { RpcLoggerInterceptor } from 'libs/utils/interceptors/logger/rpc-logger.interceptor';
import { RpcTracingInterceptor } from 'libs/utils/interceptors/logger/rpc-tracing.interceptor';

import { name, version } from '../package.json';
import { MainModule } from './modules/module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MainModule, {
    bufferLogs: true,
    transport: Transport.TCP,
    options: {
      port: new SecretsService().usersService.port,
    },
  });

  const loggerService = app.get(ILoggerService);

  loggerService.setApplication(name);
  app.useGlobalFilters(new RpcExceptionFilter(loggerService));

  app.useGlobalInterceptors(
    new RpcExceptionInterceptor(),
    new RpcLoggerInterceptor(loggerService),
    new RpcTracingInterceptor({ app: name, version }, loggerService),
  );

  const {
    usersService: { port: PORT },
    ENV,
    KIBANA_URL,
    JEAGER_URL,
    MONGO_EXPRESS_URL,
    REDIS_COMMANDER_URL,
  } = app.get(ISecretsService);

  app.useLogger(loggerService);

  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED }));

  loggerService.log(`🟢 ${name} listening at ${bold(PORT)} on ${bold(ENV?.toUpperCase())} 🟢\n`);

  await app.listen();

  loggerService.log(`🔵 mongo-express listening at ${bold(MONGO_EXPRESS_URL)}`);
  loggerService.log(`🔵 redis-commander listening at ${bold(REDIS_COMMANDER_URL)}`);
  loggerService.log(`🔵 kibana listening at ${bold(KIBANA_URL)}`);
  loggerService.log(`🔵 jeager listening at ${bold(JEAGER_URL)}`);
}
bootstrap();
