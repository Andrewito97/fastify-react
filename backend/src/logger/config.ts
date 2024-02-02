import { FastifyLoggerOptions, PinoLoggerOptions } from 'fastify/types/logger';
import { logTimestamp } from './index';

export const loggerConfig: FastifyLoggerOptions & PinoLoggerOptions = {
  timestamp: logTimestamp,
  formatters: {
    level: function (label) {
      return {
        level: label,
      };
    },
  },
  serializers: {
    req: function (req) {
      return {
        method: req.method,
        url: req.url,
      };
    },
    err: function (err) {
      return {
        type: err.code,
        message: err.message,
        // Remove extra stack trace on Bad Request errors
        stack: undefined as unknown as string,
      };
    },
  },
  base: null,
  messageKey: 'message',
  errorKey: 'error',
};
