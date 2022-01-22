const pgp = require('pg-promise')();

const db = pgp(process.env.DB_URL, {
  ssl: { rejectUnauthorized: false }
});

module.exports = db;