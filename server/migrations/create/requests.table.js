import { Pool } from 'pg';
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
pool.query(
  `CREATE TABLE requests (id serial PRIMARY KEY, 
                title VARCHAR(61) not null, 
                description VARCHAR(500) not null, 
                comment VARCHAR(500), 
                date timestamp not null, 
                status VARCHAR(20) not null, 
                userId uuid not null references users(id))`,
  () => {
    pool.end();
  },
);
