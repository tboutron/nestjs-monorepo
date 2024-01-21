import { CreatedModel } from 'libs/modules';
import { Swagger } from 'libs/utils/documentation/swagger';

import { TeamEntity } from './entity';

export const SwagggerResponse = {
  list: {
    200: Swagger.defaultResponseJSON({
      json: [{ id: '<id>', name: 'Some team' }] as Array<TeamEntity>,
      status: 200,
      description: 'list successfully',
    }),
    401: Swagger.defaultResponseError({
      status: 401,
      route: 'api/teams',
      description: 'unauthorized',
    }),
    500: Swagger.defaultResponseError({
      status: 500,
      route: 'api/teams',
      description: 'list unsuccessfully',
    }),
  },
  get: {
    200: Swagger.defaultResponseJSON({
      json: { id: '<id>', name: 'Some team' } as TeamEntity,
      status: 200,
      description: 'get successfully',
    }),
    401: Swagger.defaultResponseError({
      status: 401,
      route: 'api/teams',
      description: 'unauthorized',
    }),
    500: Swagger.defaultResponseError({
      status: 500,
      route: 'api/teams',
      description: 'get unsuccessfully',
    }),
  },
  create: {
    201: Swagger.defaultResponseJSON({
      json: { id: '<id>', created: true } as CreatedModel<TeamEntity>,
      status: 201,
      description: 'create successfully',
    }),
    401: Swagger.defaultResponseError({
      status: 401,
      route: 'api/teams',
      description: 'unauthorized',
    }),
    500: Swagger.defaultResponseError({
      status: 500,
      route: 'api/teams',
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
      route: 'api/teams',
      description: 'unauthorized',
    }),
    500: Swagger.defaultResponseError({
      status: 500,
      route: 'api/teams',
      description: 'delete unsuccessfully',
    }),
  },
};

export class SwagggerRequest {
  /** If requesters has a body.  */
}
