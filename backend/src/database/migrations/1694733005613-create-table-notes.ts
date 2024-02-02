import { Connection } from 'mysql2/promise';

export async function up(connection: Connection): Promise<void> {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id                SERIAL              NOT NULL       PRIMARY KEY,
      title             VARCHAR(100)        NOT NULL,
      description       TEXT                NOT NULL,
      created_at        TIMESTAMP           NOT NULL       DEFAULT NOW(),
      updated_at        TIMESTAMP           NULL           ON UPDATE NOW()
    );
  `);
}

export async function down(connection: Connection): Promise<void> {
  await connection.query('DROP TABLE IF EXISTS notes');
}
