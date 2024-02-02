import { FastifyBaseLogger } from 'fastify';
import { IServer } from '../../server/interface';
import { ICreateTag, IGetTag, ITagIdParam, IUpdateTag } from './interface';
import { TagSchema } from './schema';
import { IMySQLConnection } from '../../database/interface';
import { NotFound } from '../../errors';

async function validateIfTagExist(
  mysql: IMySQLConnection,
  logger: FastifyBaseLogger,
  id: number
): Promise<void> {
  const tag = await mysql.queryOne<{ id: number }>(`SELECT id FROM tags WHERE id = ${id}`, logger);

  if (!tag) {
    throw new NotFound('Tag is not found');
  }
}

export async function tags(server: IServer) {
  server.get('/tags', async function getTags(request) {
    return server.mysql!.queryMany<IGetTag>(`SELECT id, name, color FROM tags;`, request.log);
  });

  server.post<{ Body: ICreateTag }>(
    '/tags',
    { schema: { body: TagSchema } },
    async function createTag(request, response): Promise<IGetTag> {
      await server.mysql!.executeMutation(
        `INSERT INTO tags (name, color) 
         VALUES ('${request.body.name}', '${request.body.color}');`,
        request.log
      );

      const tag = await server.mysql!.queryOne<IGetTag>(
        `SELECT id, name, color
         FROM tags
         WHERE id = LAST_INSERT_ID();`,
        request.log
      );

      return response.status(201).send(tag);
    }
  );

  server.put<{ Params: ITagIdParam; Body: IUpdateTag }>(
    '/tags/:id',
    { schema: { body: TagSchema } },
    async function updateNote(request, response): Promise<void> {
      await validateIfTagExist(server.mysql!, request.log, +request.params.id);

      await server.mysql!.executeMutation(
        `UPDATE tags
         SET 
           name = '${request.body.name}', 
           color = '${request.body.color}'
         WHERE id = ${request.params.id};`,
        request.log
      );

      response.status(204);
    }
  );

  server.delete<{ Params: ITagIdParam }>(
    '/tags/:id',
    async function deleteNote(request, response): Promise<void> {
      await validateIfTagExist(server.mysql!, request.log, +request.params.id);

      await server.mysql!.executeMutation(
        `DELETE FROM notes_tags
         WHERE tag_id = ${request.params.id};`,
        request.log
      );

      await server.mysql!.executeMutation(
        `DELETE FROM tags
         WHERE id = ${request.params.id};`,
        request.log
      );

      response.status(204);
    }
  );
}
