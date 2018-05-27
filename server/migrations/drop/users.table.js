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
  // ssl: true,
});

pool.query('DROP TABLE IF EXISTS users, requests CASCADE;', () => {

});

const client = new Client({
  connectionString,
  // ssl: true,
});
client.connect();
client.end();

