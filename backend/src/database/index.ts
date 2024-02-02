import { fastifyMysql } from '@fastify/mysql';
import { fastifyPlugin } from 'fastify-plugin';
import { RowDataPacket } from 'mysql2/promise';

import { dbConfig } from './config';
import { IServer } from '../server/interface';
import { trimLiteral } from '../helpers';
import { FastifyBaseLogger, FastifyRequest } from 'fastify';

export default fastifyPlugin(function (server: IServer, {}, done) {
  server.register(fastifyMysql, dbConfig);

  server.after(function () {
    /**
     * Execute and log SELECT query and return array of records
     */
    server!.mysql!.queryMany = async function <T>(
      sql: string,
      logger: FastifyBaseLogger
    ): Promise<T[]> {
      logger.info({ sql: trimLiteral(sql) }, 'select query executed');
      const data = await server.mysql!.query<RowDataPacket[]>(sql);
      return data![0] as T[];
    };

    /**
     * Execute and log SELECT query and return single record
     */
    server!.mysql!.queryOne = async function <T>(
      sql: string,
      logger: FastifyBaseLogger
    ): Promise<T | null> {
      logger.info({ sql: trimLiteral(sql) }, 'select query executed');
      const data = await server.mysql!.query<RowDataPacket[]>(sql);
      return (data![0][0] as T) || null;
    };

    /**
     * Execute and log INSERT/UPDATE/DELETE query
     */
    server!.mysql!.executeMutation = async function (
      sql: string,
      logger: FastifyBaseLogger
    ): Promise<void> {
      logger.info({ sql: trimLiteral(sql) }, 'mutation query executed');
      await server!.mysql!.execute(sql);
    };
  });

  done();
});
