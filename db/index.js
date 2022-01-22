const pgp = require('pg-promise')();

pgp.defaults.ssl = true;

const db = pgp(process.env.DB_URL, {
  ssl: { rejectUnauthorized: false }
});

module.exports = db;