import { Connection } from 'mysql2/promise';

export async function up(connection: Connection): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS notes_tags (
      id                SERIAL              NOT NULL       PRIMARY KEY,
      note_id           BIGINT UNSIGNED     NOT NULL,
      tag_id            BIGINT UNSIGNED     NOT NULL,

      FOREIGN KEY (note_id) REFERENCES notes(id),
      FOREIGN KEY (tag_id) REFERENCES tags(id)
    );
  `);
}

export async function down(connection: Connection): Promise<void> {
  await connection.query('DROP TABLE IF EXISTS notes_tags');
}
