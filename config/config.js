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
    username: 'Dreamers',
    password: process.env.DATABASE_PASSWORD,
    database: 'zeroto66',
    host: 'zeroto66-database.cm6ux33fkxtm.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql',
    logging: false,
  },
  secret: 'worldisfullofdevelopers',
};
