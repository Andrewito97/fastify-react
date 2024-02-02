import { Connection } from 'mysql2/promise';

export async function up(connection: Connection): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS tags (
      id                SERIAL              NOT NULL       PRIMARY KEY,
      name              VARCHAR(100)        NOT NULL,
      color             VARCHAR(20)         NOT NULL
    );
  `);
}

export async function down(connection: Connection): Promise<void> {
  await connection.query('DROP TABLE IF EXISTS tags');
}
