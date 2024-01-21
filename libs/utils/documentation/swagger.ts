import { ApiResponseOptions } from '@nestjs/swagger';

import { ErrorModel } from '../exception';
import * as htttpStatus from '../static/htttp-status.json';

type SwaggerError = {
  status: number;
  route: string;
  message?: string;
  description?: string;
};

type SwaggerText = {
  status: number;
  text: string;
  description?: string;
};

type SwaggerJSON = {
  status: number;
  json: unknown;
  description?: string;
};

export const Swagger = {
  defaultResponseError({ status, route, message, description }: SwaggerError): ApiResponseOptions {
    return {
      schema: {
        example: {
          error: {
            code: status,
            traceId: '<traceId>',
            message: [message, htttpStatus[String(status)]].find(Boolean),
            timestamp: '<timestamp>',
            path: route,
          },
        } as ErrorModel,
      },
      description,
      status,
    };
  },

  defaultResponseText({ status, text, description }: SwaggerText): ApiResponseOptions {
    return {
      content: {
        'text/plain': {
          schema: {
            example: text,
          },
        },
      },
      description,
      status,
    };
  },

  defaultResponseJSON({ status, json, description }: SwaggerJSON): ApiResponseOptions {
    return {
      content: {
        'application/json': {
          schema: {
            example: json,
          },
        },
      },
      description,
      status,
    };
  },

  defaultRequestJSON(jsonExample: unknown): ApiResponseOptions {
    return {
      schema: {
        example: jsonExample,
      },
    };
  },
  defaultsRequestJSON(jsonExamples: unknown[]): ApiResponseOptions {
    return {
      schema: {
        examples: jsonExamples,
      },
    };
  },
};
