require('dotenv').config();
module.exports = {
  development: {
    username: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'zeroto66',
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  },
  test: {
    username: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'zeroto66',
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'zeroto66',
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  },
  secret: 'worldisfullofdevelopers',
};
