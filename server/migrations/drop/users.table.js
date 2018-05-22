import dotenv from 'dotenv';
import { Pool, Client } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('DROP TABLE IF EXISTS users, requests CASCADE;', () => {

});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();
client.end();

