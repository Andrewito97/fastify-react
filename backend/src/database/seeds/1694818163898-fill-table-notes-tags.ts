import { Connection } from 'mysql2/promise';

export async function fill(connection: Connection): Promise<void> {
  await connection.query(`
    INSERT INTO notes_tags(
      note_id,
      tag_id 
    )
    VALUES
    (
      1, 1
    ),
    (
      2, 2
    ),
    (
      3, 3
    )
  `);
}

export async function clear(connection: Connection): Promise<void> {
  await connection.query('TRUNCATE TABLE notes_tags');
}
