import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;
let connectionString;

if (env === 'development') {
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = process.env.use_env_variable;
}

const pool = new Pool({
  connectionString,
});

/**
 * @description - async/await connection pool
 *
 * @param {string} sqlQuery HTTP Request
 */
(async () => {
  await pool.query('INSERT INTO requests ' +
    '(title, description, date, status, userid) VALUES ' +
    "('Broken Desk', " +
    "'One of the desks in my office is broken. When will it be fixed and repaired. It is very important.', " +
    "'04-20-2018', " +
    "'New', " +
    "'1e8a9783-40a7-453b-b3c3-9f5c8bab7988'); " +

    'INSERT INTO requests ' +
    '(title, description, date, status, userid) VALUES ' +
    "('Broken Monitor', " +
    "'One of the Monitors in my office is broken. When will it be fixed and repaired. It is very important.', " +
    "'04-21-2018', " +
    "'New', " +
    "'5279385d-f6e5-4d03-82d2-b1c5d194b4c5'); " +

    'INSERT INTO requests ' +
    '(title, description, date, status, userid) VALUES ' +
    "('Laptop Over-Heating', " +
    "'Please My laptop is emitting smoke and over heating. When will it be fixed and repaired. It is very important.', " +
    "'04-23-2018', " +
    "'New', " +
    "'041b755d-3651-4571-92b2-f28bcbf8adcc'); " +

    'INSERT INTO requests ' +
    '(title, description, date, status, userid) VALUES ' +
    "('Office Printer Not Working', " +
    "'One of the Office Printers in my office is broken. When will it be fixed and repaired. It is very important.', " +
    "'04-24-2018', " +
    "'New', " +
    "'1e8a9783-40a7-453b-b3c3-9f5c8bab7988'); " +

    'INSERT INTO requests ' +
    '(title, description, date, status, userid) VALUES ' +
    "('Office Chairs Are All squeaky', " +
    "'All the Office Chairs Are squeaky in my office and one is broken. When will it be fixed and repaired. It is very important.', " +
    "'05-25-2018', " +
    "'New', " +
    "'1e8a9783-40a7-453b-b3c3-9f5c8bab7988'); ");
  await pool.end();
})().catch(e => setImmediate(() => { throw e; }));

