import { Connection, RowDataPacket } from 'mysql2/promise';
import fs from 'fs/promises';
import { MIGRATIONS_FOLDER, SEEDS_FOLDER } from './constants';

export async function runMigrations(db: Connection): Promise<void> {
  const migrations = await fs.readdir(MIGRATIONS_FOLDER);
  try {
    await db.beginTransaction();
    await createTable(db, 'migrations');
    await db.query(`ALTER TABLE migrations AUTO_INCREMENT = 1;`);
    const executedMigrations = await getTableData(db, 'migrations');
    const pendingMigrations = migrations.filter((m) => !executedMigrations.includes(m));
    if (!pendingMigrations.length) {
      console.log('No pending migrations');
      return;
    }
    for (const migrationFileName of pendingMigrations) {
      console.log(`Running migration ${migrationFileName}...`);
      const data = await import(MIGRATIONS_FOLDER + migrationFileName);
      await data['up'](db);
      await db.query(`INSERT INTO migrations(name) VALUES('${migrationFileName}')`);
    }
    await db.commit();
    console.log('Migrations executed');
  } catch (error) {
    await db.rollback();
    throw error;
  } finally {
    await db.end();
  }
}

export async function rollbackMigrations(db: Connection): Promise<void> {
  const migrations = await fs.readdir(MIGRATIONS_FOLDER);
  try {
    await db.beginTransaction();
    await createTable(db, 'migrations');
    const executedMigrations = await getTableData(db, 'migrations');
    if (!executedMigrations.length) {
      console.log('No migrations to rollback');
      return;
    }
    for (const migrationFileName of migrations.reverse()) {
      console.log(`Reverting migration ${migrationFileName}...`);
      const data = await import(MIGRATIONS_FOLDER + migrationFileName);
      await data['down'](db);
      await db.query(`DELETE FROM migrations WHERE name = '${migrationFileName}'`);
    }
    await db.commit();
    console.log('Migrations reverted');
  } catch (error) {
    await db.rollback();
    throw error;
  } finally {
    await db.end();
  }
}

export async function runSeeds(db: Connection): Promise<void> {
  const seeds = await fs.readdir(SEEDS_FOLDER);
  try {
    await db.beginTransaction();
    await db.query(`ALTER TABLE seeds AUTO_INCREMENT = 1;`);
    await createTable(db, 'seeds');
    const executedSeeds = await getTableData(db, 'seeds');
    const pendingSeeds = seeds.filter((m) => !executedSeeds.includes(m));
    if (!pendingSeeds.length) {
      console.log('No pending seeds');
      return;
    }
    for (const seedFileName of pendingSeeds) {
      console.log(`Running seed ${seedFileName}...`);
      const data = await import(SEEDS_FOLDER + seedFileName);
      await data['fill'](db);
      await db.query(`INSERT INTO seeds(name) VALUES('${seedFileName}')`);
    }
    await db.commit();
    console.log('Seeds executed');
  } catch (error) {
    await db.rollback();
    throw error;
  } finally {
    await db.end();
  }
}

export async function rollbackSeeds(db: Connection): Promise<void> {
  const seeds = await fs.readdir(SEEDS_FOLDER);
  try {
    await db.beginTransaction();
    await createTable(db, 'seeds');
    const executedSeeds = await getTableData(db, 'seeds');
    if (!executedSeeds.length) {
      console.log('No seeds to rollback');
      return;
    }
    for (const seedFileName of seeds.reverse()) {
      console.log(`Reverting seed ${seedFileName}...`);
      const data = await import(SEEDS_FOLDER + seedFileName);
      await data['clear'](db);
      await db.query(`DELETE FROM seeds WHERE name = '${seedFileName}'`);
    }
    await db.commit();
    console.log('Seeds reverted');
  } catch (error) {
    await db.rollback();
    throw error;
  } finally {
    await db.end();
  }
}

async function createTable(db: Connection, table: 'migrations' | 'seeds'): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${table} (
      id SERIAL PRIMARY KEY NOT NULL,
      name VARCHAR(100) NOT NULL
    )
  `);
}

async function getTableData(db: Connection, table: 'migrations' | 'seeds'): Promise<string[]> {
  const rawExecutedMigrations = await db.query<RowDataPacket[]>(`SELECT name FROM ${table}`);
  return rawExecutedMigrations[0].map((m) => m.name);
}
