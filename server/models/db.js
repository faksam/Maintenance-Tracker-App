import pg from 'pg';

const db = {};

const connectionString = process.env.DATABASE_URL;

const client = new pg.Client(connectionString);

db.client = client;

module.exports = db;
