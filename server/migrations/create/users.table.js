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
  `CREATE TABLE users
    (id uuid not null PRIMARY KEY,
    fullName VARCHAR(200) not null, 
    email VARCHAR(100) not null, 
    phoneNo VARCHAR(30) not null, 
    password VARCHAR(100) not null, 
    role VARCHAR(20) not null); `,
  () => {
    pool.end();
  },
);

