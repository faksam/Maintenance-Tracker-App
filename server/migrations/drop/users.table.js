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

pool.query('DROP TABLE IF EXISTS users, requests CASCADE;', () => {

});
