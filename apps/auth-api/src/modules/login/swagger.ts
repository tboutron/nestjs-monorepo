import { Token } from 'libs/modules/auth/token/types';
import { Swagger } from 'libs/utils/documentation/swagger';

const msgInvalidCredentials = 'username or password is invalid.';
const msgInvalidInputCredentials = 'input credentials are invalid.';
export const SwagggerResponse = {
  register: {
    201: Swagger.defaultResponseJSON({
      status: 201,
      json: { token: '<token>' } as Token,
      description: 'user logged',
    }),
    400: Swagger.defaultResponseError({
      status: 400,
      route: 'api/register',
      message: msgInvalidInputCredentials,
      description: msgInvalidInputCredentials,
    }),
    401: Swagger.defaultResponseError({
      status: 401,
      route: 'api/register',
      message: msgInvalidCredentials,
      description: msgInvalidCredentials,
    }),
  },
  login: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: { token: '<token>' } as Token,
      description: 'user logged',
    }),
    412: Swagger.defaultResponseError({
      status: 412,
      route: 'api/login',
      message: msgInvalidCredentials,
      description: msgInvalidCredentials,
    }),
  },
};

export const SwagggerRequest = {
  /** If requesters has a body.  */
};
