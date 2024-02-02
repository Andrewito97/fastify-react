import { MySQLPromiseConnection, MySQLPromisePool } from '@fastify/mysql';
import { FastifyRequest } from 'fastify';

export interface IMySQLConnection
  extends MySQLPromiseConnection,
    Pick<MySQLPromisePool, 'getConnection'> {
  /**
   * Execute and log SELECT query and return array of records
   */
  queryMany: <T>(request: FastifyRequest, sql: string) => Promise<T[]>;

  /**
   * Execute and log SELECT query and return single record
   */
  queryOne: <T>(request: FastifyRequest, sql: string) => Promise<T | null>;

  /**
   * Execute and log INSERT/UPDATE/DELETE query
   */
  executeMutation: (request: FastifyRequest, sql: string) => Promise<void>;
}
