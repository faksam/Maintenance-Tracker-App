import dotenv from 'dotenv';
import { Pool, Client } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query(
  'CREATE TABLE requests' +
                '(id serial PRIMARY KEY, ' +
                'title VARCHAR(61) not null, ' +
                'description VARCHAR(500) not null, ' +
                'comment VARCHAR(500), ' +
                'date timestamp not null, ' +
                'status VARCHAR(20) not null, ' +
                'userId uuid not null references users(id))',
  () => {
    pool.end();
  }
);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

client.query('SELECT NOW()', () => {
  client.end();
});

