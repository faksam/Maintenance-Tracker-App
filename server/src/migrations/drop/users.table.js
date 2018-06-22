import { Pool } from 'pg';
import { setConnectionString } from '../../helpers/connectionString';

const connectionString = setConnectionString();

const pool = new Pool({
  connectionString,
});

pool.query('DROP TABLE IF EXISTS users, requests CASCADE;', () => {

});
