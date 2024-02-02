import mysql from 'mysql2/promise';
import { rollbackMigrations, rollbackSeeds, runMigrations, runSeeds } from './utils';
import { dbConfig } from '../config';

/**
 * Simple CLI for basic database actions:
 * - Run migrations
 * - Rollback migrations
 * - Run seeds
 * - Rollback seeds
 */
async function cli(): Promise<void> {
  const action = process.argv[2];
  const connection = await mysql.createConnection(dbConfig);

  switch (action) {
    case '--run-migrations':
      await runMigrations(connection);
      break;
    case '--rollback-migrations':
      await rollbackMigrations(connection);
      break;
    case '--run-seeds':
      await runSeeds(connection);
      break;
    case '--rollback-seeds':
      await rollbackSeeds(connection);
      break;
  }

  await connection.end();
  process.exit();
}

cli();
