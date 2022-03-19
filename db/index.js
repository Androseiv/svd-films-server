const pgp = require('pg-promise')();

const connectionConfig = {
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }
}

const db = pgp(connectionConfig);

module.exports = db;