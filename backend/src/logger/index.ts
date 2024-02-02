import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

export function logTimestamp(): string {
  return `,"timestamp":"${new Date().toISOString()}"`;
}

/**
 * The body cannot be serialized inside a req method
 * because the request is serialized when we create the child logger.
 * At that time, the body is not yet parsed.
 *
 * Suggestion from fastify docs
 */
export function logRequestBody(
  request: FastifyRequest,
  _: FastifyReply,
  done: HookHandlerDoneFunction
) {
  if (request.body) {
    request.log.info({ body: request.body }, 'parsed body');
  }
  done();
}
