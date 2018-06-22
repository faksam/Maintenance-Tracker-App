import { Pool } from 'pg';
import { setConnectionString } from '../helpers/connectionString';

const connectionString = setConnectionString();

const pool = new Pool({
  connectionString,
});

/**
 * @description - async/await connection pool
 *
 * @param {string} sqlQuery HTTP Request
 */
pool.query(
  'INSERT INTO users ' +
    '(id,fullname,email,password,role) VALUES ' +
    "('6bf54873-6033-4ab0-855d-336a34e1dfbc', " +
    "'Fakunle Mayowa Samuel', " +
    "'fakunlesamuel@gmail.com', " +
    "'$2a$12$VxSLRxS4oy/PhBsLv/GF7eB4nN8bNWL4QqNCcCiI8KWUM9zw/MlTO', " +
    "'Admin'); " +

    'INSERT INTO users ' +
    '(id,fullname,email,password,role) VALUES ' +
    "('5279385d-f6e5-4d03-82d2-b1c5d194b4c5', " +
    "'Stephen Colbert', " +
    "'receivingphotos@gmail.com', " +
    "'$2a$12$VxSLRxS4oy/PhBsLv/GF7eB4nN8bNWL4QqNCcCiI8KWUM9zw/MlTO', " +
    "'User'); " +

    'INSERT INTO users ' +
    '(id,fullname,email,password,role) VALUES ' +
    "('041b755d-3651-4571-92b2-f28bcbf8adcc', " +
    "'Jimmey Kemmel', " +
    "'fuonlineservice2016@gmail.com', " +
    "'$2a$12$VxSLRxS4oy/PhBsLv/GF7eB4nN8bNWL4QqNCcCiI8KWUM9zw/MlTO', " +
    "'User'); " +

    'INSERT INTO users ' +
    '(id,fullname,email,password,role) VALUES ' +
    "('d02f7f04-72b5-472f-b8b8-462eebc32030', " +
    "'James Corden', " +
    "'jamescoord@gmail.com', " +
    "'$2a$12$VxSLRxS4oy/PhBsLv/GF7eB4nN8bNWL4QqNCcCiI8KWUM9zw/MlTO', " +
    "'User'); " +

    'INSERT INTO users ' +
    '(id,fullname,email,password,role) VALUES ' +
    "('a355873c-8a4f-43e5-a48b-928543fc0241', " +
    "'Javascript Samuel', " +
    "'fakunlesamuel@live.com', " +
    "'$2a$12$VxSLRxS4oy/PhBsLv/GF7eB4nN8bNWL4QqNCcCiI8KWUM9zw/MlTO', " +
    "'User'); " +

    'INSERT INTO users ' +
    '(id,fullname,email,password,role) VALUES ' +
    "('1e8a9783-40a7-453b-b3c3-9f5c8bab7988', " +
    "'Emmanuel Maccron', " +
    "'emmanuelmaarc@gmail.com', " +
    "'$2a$12$VxSLRxS4oy/PhBsLv/GF7eB4nN8bNWL4QqNCcCiI8KWUM9zw/MlTO', " +
    "'User'); ",
  () => {
    pool.end();
  },
);
