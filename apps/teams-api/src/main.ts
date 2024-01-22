import { HttpStatus, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { bold } from 'colorette';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { ISecretsService } from 'libs/modules/global/secrets/adapter';
import { DEFAULT_TAG, SWAGGER_API_ROOT } from 'libs/utils/documentation/constants';
import { HttpExceptionFilter } from 'libs/utils/filters/http-exception.filter';
import { HttpExceptionInterceptor } from 'libs/utils/interceptors/exception/http-exception.interceptor';
import { HttpLoggerInterceptor } from 'libs/utils/interceptors/logger/http-logger.interceptor';
import { HttpTracingInterceptor } from 'libs/utils/interceptors/logger/http-tracing.interceptor';

import { description, name, version } from '../package.json';
import { MainModule } from './modules/module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    bufferLogs: true,
    cors: true,
  });
  app.disable('x-powered-by');

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
    }),
  );

  const loggerService = app.get(ILoggerService);

  loggerService.setApplication(name);
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));

  app.useGlobalInterceptors(
    new HttpExceptionInterceptor(),
    new HttpLoggerInterceptor(loggerService),
    new HttpTracingInterceptor({ app: name, version: version }, loggerService),
  );

  const {
    teamsAPI: { port: PORT, url },
    ENV,
    KIBANA_URL,
    JEAGER_URL,
    MONGO_EXPRESS_URL,
    REDIS_COMMANDER_URL,
  } = app.get(ISecretsService);

  app.useLogger(loggerService);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addTag(DEFAULT_TAG)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

  loggerService.log(`🟢 ${name} listening at ${bold(PORT)} on ${bold(ENV?.toUpperCase())} 🟢\n`);

  await app.listen(PORT);

  const openApiURL = `${url}/${SWAGGER_API_ROOT}`;

  loggerService.log(`🔵 swagger listening at ${bold(openApiURL)}`);
  loggerService.log(`🔵 mongo-express listening at ${bold(MONGO_EXPRESS_URL)}`);
  loggerService.log(`🔵 redis-commander listening at ${bold(REDIS_COMMANDER_URL)}`);
  loggerService.log(`🔵 kibana listening at ${bold(KIBANA_URL)}`);
  loggerService.log(`🔵 jeager listening at ${bold(JEAGER_URL)}`);
}

bootstrap();
