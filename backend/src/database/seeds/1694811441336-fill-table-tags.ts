import { Connection } from 'mysql2/promise';

export async function fill(connection: Connection): Promise<void> {
  await connection.query(`ALTER TABLE tags AUTO_INCREMENT = 1;`);
  await connection.query(`
    INSERT INTO tags(
      name,
      color
    ) 
    VALUES
    (
      'today',
      'greenyellow'
    ),
    (
      'tomorrow',
      'palevioletred'
    ),
    (
      'at the weekends',
      'lightskyblue'
    )
  `);
}

export async function clear(connection: Connection): Promise<void> {
  await connection.query('DELETE FROM tags');
}
