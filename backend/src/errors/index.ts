import { errorCodes } from 'fastify';

class Error {
  readonly statusCode: number;
  readonly code: keyof typeof errorCodes;
  readonly error: string;
  readonly message: string;
  constructor(error: string, statusCode: number, code: keyof typeof errorCodes, message: string) {
    this.statusCode = statusCode;
    this.code = code;
    this.error = error;
    this.message = message;
  }
}

export class NotFound extends Error {
  constructor(message: string) {
    super('Not Found', 404, 'FST_ERR_NOT_FOUND', message);
  }
}

export class Conflict extends Error {
  constructor(message: string, code: keyof typeof errorCodes) {
    super('Conflict', 422, code, message);
  }
}
