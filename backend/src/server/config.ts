import { FastifyServerOptions } from 'fastify';
import { randomUUID } from 'crypto';
import { loggerConfig } from '../logger/config';

export const serverConfig: FastifyServerOptions = {
  genReqId: function () {
    return randomUUID();
  },
  requestIdLogLabel: 'id',
  logger: loggerConfig,
};
