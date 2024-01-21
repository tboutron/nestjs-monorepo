import { CreatedModel } from 'libs/modules';
import { Swagger } from 'libs/utils/documentation/swagger';

import { TeamUserEntity } from './entity';

const route = 'api/team-users';
export const SwaggerResponse = {
  list: {
    200: Swagger.defaultResponseJSON({
      json: [
        { id: '<id>', team: '<team>', user: '<user>', joinedAt: new Date().toISOString() } as never as TeamUserEntity,
      ],
      status: 200,
      description: 'list successfully',
    }),
    401: Swagger.defaultResponseError({
      status: 401,
      route,
      description: 'unauthorized',
    }),
    500: Swagger.defaultResponseError({
      status: 500,
      route,
      description: 'list unsuccessfully',
    }),
  },
  get: {
    200: Swagger.defaultResponseJSON({
      json: {
        id: '<id>',
        team: '<team>',
        user: '<user>',
        joinedAt: new Date().toISOString(),
      } as never as TeamUserEntity,
      status: 200,
      description: 'get successfully',
    }),
    401: Swagger.defaultResponseError({
      status: 401,
      route,
      description: 'unauthorized',
    }),
    500: Swagger.defaultResponseError({
      status: 500,
      route,
      description: 'get unsuccessfully',
    }),
  },
  create: {
    201: Swagger.defaultResponseJSON({
      json: { id: '<id>', created: true } as CreatedModel<TeamUserEntity>,
      status: 201,
      description: 'create successfully',
    }),
    401: Swagger.defaultResponseError({
      status: 401,
      route,
      description: 'unauthorized',
    }),
    500: Swagger.defaultResponseError({
      status: 500,
      route,
      description: 'create unsuccessfully',
    }),
  },
  delete: {
    200: Swagger.defaultResponseJSON({
      json: true,
      status: 200,
      description: 'delete successfully',
    }),
    401: Swagger.defaultResponseError({
      status: 401,
      route,
      description: 'unauthorized',
    }),
    500: Swagger.defaultResponseError({
      status: 500,
      route,
      description: 'delete unsuccessfully',
    }),
  },
};

export class SwagggerRequest {
  /** If requesters has a body.  */
}
