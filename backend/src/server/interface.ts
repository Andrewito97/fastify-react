import { FastifyInstance } from 'fastify';
import { IMySQLConnection } from '../database/interface';

export interface IServer extends FastifyInstance {
  mysql?: IMySQLConnection;
}
