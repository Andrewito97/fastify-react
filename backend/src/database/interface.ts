import { MySQLPromiseConnection, MySQLPromisePool } from '@fastify/mysql';
import { FastifyBaseLogger } from 'fastify';

export interface IMySQLConnection
  extends MySQLPromiseConnection,
    Pick<MySQLPromisePool, 'getConnection'> {
  /**
   * Execute and log SELECT query and return array of records
   */
  queryMany: <T>(sql: string, logger: FastifyBaseLogger) => Promise<T[]>;

  /**
   * Execute and log SELECT query and return single record
   */
  queryOne: <T>(sql: string, logger: FastifyBaseLogger) => Promise<T | null>;

  /**
   * Execute and log INSERT/UPDATE/DELETE query
   */
  executeMutation: (sql: string, logger: FastifyBaseLogger) => Promise<void>;
}
