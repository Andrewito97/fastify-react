import { FastifyRequest, FastifyReply } from 'fastify';
import { IServer } from '../../server/interface';
import { ICreateTag, IGetTag, ITagIdParam, IUpdateTag } from './interface';
import { TagSchema } from './schema';
import { IMySQLConnection } from '../../database/interface';
import { NotFound } from '../../errors';

async function validateIfTagExist(
  mysql: IMySQLConnection,
  request: FastifyRequest,
  id: number
): Promise<void> {
  const tag = await mysql.queryOne<{ id: number }>(request, `SELECT id FROM tags WHERE id = ${id}`);

  if (!tag) {
    throw new NotFound('Tag is not found');
  }
}

export async function tags(server: IServer) {
  server.get('/tags', async function getTags(request) {
    return server.mysql!.queryMany<IGetTag>(request, `SELECT id, name, color FROM tags;`);
  });

  server.post<{ Body: ICreateTag }>(
    '/tags',
    { schema: { body: TagSchema } },
    async function createTag(request, response): Promise<IGetTag> {
      await server.mysql!.executeMutation(
        request,
        `INSERT INTO tags (name, color) 
         VALUES ('${request.body.name}', '${request.body.color}');`
      );

      const tag = await server.mysql!.queryOne<IGetTag>(
        request,
        `SELECT id, name, color
         FROM tags
         WHERE id = LAST_INSERT_ID();`
      );

      return response.status(201).send(tag);
    }
  );

  server.put<{ Params: ITagIdParam; Body: IUpdateTag }>(
    '/tags/:id',
    { schema: { body: TagSchema } },
    async function updateNote(request, response): Promise<void> {
      await validateIfTagExist(server.mysql!, request, +request.params.id);

      await server.mysql!.executeMutation(
        request,
        `UPDATE tags
         SET 
           name = '${request.body.name}', 
           color = '${request.body.color}'
         WHERE id = ${request.params.id};`
      );

      response.status(204);
    }
  );

  server.delete<{ Params: ITagIdParam }>(
    '/tags/:id',
    async function deleteNote(request, response): Promise<void> {
      await validateIfTagExist(server.mysql!, request, +request.params.id);

      await server.mysql!.executeMutation(
        request,
        `DELETE FROM notes_tags
         WHERE tag_id = ${request.params.id};`
      );

      await server.mysql!.executeMutation(
        request,
        `DELETE FROM tags
         WHERE id = ${request.params.id};`
      );

      response.status(204);
    }
  );
}
