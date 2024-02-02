import { FastifyBaseLogger } from 'fastify';
import { IMySQLConnection } from '../../database/interface';
import { IServer } from '../../server/interface';
import { IAssignTags, ICreateNote, IGetNote, INoteIdParam, IUpdateNote } from './interface';
import { NotFound } from '../../errors';
import { NoteSchema, NoteTagsSchema } from './schema';

async function validateIfNoteExist(
  mysql: IMySQLConnection,
  logger: FastifyBaseLogger,
  id: number
): Promise<void> {
  const note = await mysql.queryOne<{ id: number }>(
    `SELECT id FROM notes WHERE id = ${id}`,
    logger
  );

  if (!note) {
    throw new NotFound('Note is not found');
  }
}

export async function notes(server: IServer): Promise<void> {
  server.get<{ Querystring: { tag?: string } }>('/notes', async function getNotes(request): Promise<
    IGetNote[]
  > {
    const { tag } = request.query;
    return server.mysql!.queryMany<IGetNote>(
      `SELECT
         notes.id,
         notes.title,
         notes.description,
         notes.created_at AS "createdAt",
         notes.updated_at AS "updatedAt",
         (
          CASE 
            WHEN nt.note_id 
            THEN JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', tags.id,
                'name', tags.name,
                'color', tags.color
              )
            ) 
            ELSE JSON_ARRAY() 
          END
         ) AS "tags"
       FROM notes
       LEFT JOIN notes_tags AS nt ON notes.id = nt.note_id
       LEFT JOIN tags ON tags.id = nt.tag_id
       GROUP BY notes.id, nt.note_id
       ${tag ? `HAVING tags ->> '$[*].name' LIKE '%${tag}%'` : ''};`,
      request.log
    );
  });

  server.post<{ Body: ICreateNote }>(
    '/notes',
    { schema: { body: NoteSchema } },
    async function createNote(request, response): Promise<IGetNote | null> {
      await server.mysql!.executeMutation(
        `INSERT INTO notes(title, description)
         VALUES ('${request.body.title}', '${request.body.description}');`,
        request.log
      );

      const note = await server.mysql!.queryOne<IGetNote>(
        `SELECT
           id,
           title,
           description,
           created_at AS "createdAt",
           updated_at AS "updatedAt",
           JSON_ARRAY() AS "tags"
         FROM notes
         WHERE id = LAST_INSERT_ID();`,
        request.log
      );

      return response.status(201).send(note);
    }
  );

  server.get<{ Params: INoteIdParam }>(
    '/notes/:id',
    async function getNote(request): Promise<IGetNote | null> {
      return server.mysql!.queryOne<IGetNote>(
        `SELECT
           id,
           title,
           description,
           created_at AS "createdAt",
           updated_at AS "updatedAt"
           FROM notes
         WHERE id = ${request.params.id};,
       `,
        request.log
      );
    }
  );

  server.put<{ Params: INoteIdParam; Body: IUpdateNote }>(
    '/notes/:id',
    { schema: { body: NoteSchema } },
    async function updateNote(request, response): Promise<void> {
      await validateIfNoteExist(server.mysql!, request.log, +request.params.id);

      await server.mysql!.executeMutation(
        `UPDATE notes
         SET 
           title = '${request.body.title}', 
           description = '${request.body.description}'
         WHERE id = ${request.params.id};`,
        request.log
      );

      response.status(204);
    }
  );

  server.delete<{ Params: INoteIdParam }>(
    '/notes/:id',
    async function deleteNote(request, response): Promise<void> {
      await validateIfNoteExist(server.mysql!, request.log, +request.params.id);

      await server.mysql!.executeMutation(
        `DELETE FROM notes_tags
         WHERE note_id = ${request.params.id};`,
        request.log
      );
      await server.mysql!.executeMutation(
        `DELETE FROM notes
         WHERE id = ${request.params.id};`,
        request.log
      );

      response.status(204);
    }
  );

  server.post<{ Params: INoteIdParam; Body: IAssignTags }>(
    '/notes/:id/tags',
    { schema: { body: NoteTagsSchema } },
    async function assignTagsToNote(request, response): Promise<IGetNote | null> {
      const noteId = request.params.id;
      const values = request.body.tagIds.map((tagId) => `('${noteId}', '${tagId}')`).join();

      await server.mysql!.executeMutation(
        `DELETE FROM notes_tags
         WHERE note_id = ${noteId};`,
        request.log
      );

      if (values.length) {
        await server.mysql!.executeMutation(
          `INSERT INTO notes_tags(note_id, tag_id)
           VALUES ${values};`,
          request.log
        );
      }

      return response.status(201);
    }
  );
}
