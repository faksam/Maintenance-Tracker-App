import dotenv from 'dotenv';
import { Pool, Client } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query(
  'CREATE TABLE users ' +
    '(id uuid not null PRIMARY KEY, ' +
    'fullName VARCHAR(200) not null, ' +
    'email VARCHAR(100) not null, ' +
    'phoneNo VARCHAR(30) not null, ' +
    'role VARCHAR(20) not null); ',
  (err) => {
    pool.end();
  }
);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();
client.end();

