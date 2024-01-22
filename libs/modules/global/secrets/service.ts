import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LevelWithSilent } from 'pino';

import { ISecretsService } from './adapter';
import { AuthAPIEnvironment, TeamsAPIEnvironment, UserServiceEnvironment } from './enum';

@Injectable()
export class SecretsService extends ConfigService implements ISecretsService {
  ELK_URL = this.get('ELK_URL');

  MONGO_EXPRESS_URL = this.get('MONGO_EXPRESS_URL');
  REDIS_COMMANDER_URL = this.get('REDIS_COMMANDER_URL');
  JEAGER_URL = this.get('JEAGER_URL');
  KIBANA_URL = this.get('KIBANA_URL');

  REDIS_URL = this.get('REDIS_URL');

  ENV = this.get('ENV');

  LOG_LEVEL = this.get<LevelWithSilent>('LOG_LEVEL');

  database = {
    host: this.get('MONGO_HOST'),
    port: this.get<number>('MONGO_PORT'),
    user: this.get('MONGO_INITDB_ROOT_USERNAME'),
    pass: this.get('MONGO_INITDB_ROOT_PASSWORD'),
  };

  usersService = {
    port: this.get<number>(UserServiceEnvironment.PORT),
  };

  authAPI = {
    port: this.get<number>(AuthAPIEnvironment.PORT),
    url: this.get(AuthAPIEnvironment.URL),
    jwtToken: this.get(AuthAPIEnvironment.SECRET_JWT),
  };

  teamsAPI = {
    port: this.get<number>(TeamsAPIEnvironment.PORT),
    url: this.get(TeamsAPIEnvironment.URL),
  };

  GITHUB_SCRAP_API = this.get('GITHUB_SCRAP_API');
}
