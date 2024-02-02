import { MySQLOptions } from '@fastify/mysql';

export const dbConfig: MySQLOptions = {
  database: 'fastify_db',
  port: 3306,
  user: 'root',
  password: 'admin',
  promise: true,
  typeCast(field, next) {
    if (field.type === 'NEWDECIMAL') {
      return Number(field.string());
    }
    return next();
  },
};
