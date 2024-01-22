export abstract class ISecretsService {
  ENV: string;
  REDIS_URL: string;

  ELK_URL: string;

  MONGO_EXPRESS_URL: string;
  JEAGER_URL: string;
  REDIS_COMMANDER_URL: string;
  KIBANA_URL: string;

  LOG_LEVEL: string;

  database: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };

  usersService: {
    port: number;
  };

  authAPI: {
    port: number;
    jwtToken: string;
    url: string;
  };

  teamsAPI: {
    port: number;
    url: string;
  };

  GITHUB_SCRAP_API: string;
}
