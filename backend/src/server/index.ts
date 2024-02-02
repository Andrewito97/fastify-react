import cors from '@fastify/cors';
import Fastify from 'fastify';
import database from '../database';
import { IServer } from './interface';
import { logRequestBody } from '../logger';
import { serverConfig } from './config';
import { notes } from '../modules/notes';
import { tags } from '../modules/tags';

const server: IServer = Fastify(serverConfig);

server.register(cors);
server.register(database);
server.register(notes);
server.register(tags);

server.addHook('preHandler', logRequestBody);

server.ready(function () {
  const routesTree = server.printRoutes({ commonPrefix: false });
  console.log('Routes tree initialized: \n', routesTree);
});

server.listen({ port: 3000 });
