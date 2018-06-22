import { Pool } from 'pg';
import { setConnectionString } from '../../helpers/connectionString';

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
  `CREATE TABLE users
    (id uuid not null PRIMARY KEY,
    fullName VARCHAR(200) not null, 
    email VARCHAR(100) not null, 
    password VARCHAR(100) not null, 
    role VARCHAR(20) not null); `,
  () => {
    pool.end();
  },
);

