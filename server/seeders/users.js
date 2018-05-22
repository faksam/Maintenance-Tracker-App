import dotenv from 'dotenv';
import { Pool, Client } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// async/await
(async () => {
  await pool.query('INSERT INTO users ' +
    '(id,fullname,email,phoneNo,role) VALUES ' +
    "('6bf54873-6033-4ab0-855d-336a34e1dfbc', " +
    "'Fakunle Mayowa Samuel', " +
    "'fakunlesamuel@gmail.com', " +
    "'07039248533', " +
    "'Admin'); " +

    'INSERT INTO users ' +
    '(id,fullname,email,phoneNo,role) VALUES ' +
    "('5279385d-f6e5-4d03-82d2-b1c5d194b4c5', " +
    "'Stephen Colbert', " +
    "'stephencoljha@gmail.com', " +
    "'09024368060', " +
    "'User'); " +

    'INSERT INTO users ' +
    '(id,fullname,email,phoneNo,role) VALUES ' +
    "('041b755d-3651-4571-92b2-f28bcbf8adcc', " +
    "'Jimmey Kemmel', " +
    "'jimmeykimml@gmail.com', " +
    "'09024368060', " +
    "'User'); " +

    'INSERT INTO users ' +
    '(id,fullname,email,phoneNo,role) VALUES ' +
    "('d02f7f04-72b5-472f-b8b8-462eebc32030', " +
    "'James Corden', " +
    "'jamescoord@gmail.com', " +
    "'09024368060', " +
    "'User'); " +

    'INSERT INTO users ' +
    '(id,fullname,email,phoneNo,role) VALUES ' +
    "('a355873c-8a4f-43e5-a48b-928543fc0241', " +
    "'Javascript Samuel', " +
    "'fakunlesamuel@live.com', " +
    "'09024368060', " +
    "'User'); " +

    'INSERT INTO users ' +
    '(id,fullname,email,phoneNo,role) VALUES ' +
    "('1e8a9783-40a7-453b-b3c3-9f5c8bab7988', " +
    "'Emmanuel Maccron', " +
    "'emmanuelmaarc@gmail.com', " +
    "'09024368060', " +
    "'User'); ");
  await pool.end();
})().catch(e => setImmediate(() => { throw e; }));


const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();
client.end();

