import { Connection } from 'mysql2/promise';

export async function fill(connection: Connection): Promise<void> {
  await connection.query(`ALTER TABLE notes AUTO_INCREMENT = 1;`);
  await connection.query(`
    INSERT INTO notes(
      title,
      description
    ) 
    VALUES
    (
      'Feed a dog',
      'Do not forget to feed my dog at the evening'
    ),
    (
      'Buy a gift',
      'Tomorrow need to find a gift for Lucy'
    ),
    (
      'Return a book',
      'Next Sunday should return a book to the library'
    )
  `);
}

export async function clear(connection: Connection): Promise<void> {
  await connection.query('DELETE FROM notes');
}
