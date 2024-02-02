require('dotenv').config()

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL

const MYSQL_HOST= process.env.MYSQL_HOST;
const MYSQL_USER= process.env.MYSQL_USER;
const MYSQL_PASSWORD= process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE= process.env.MYSQL_DATABASE;


const PG_HOST= process.env.PG_HOST;
const PG_USER= process.env.PG_USER;
const PG_PASSWORD= process.env.PG_PASSWORD;
const PG_DATABASE= process.env.PG_DATABASE;

const MSSQL_HOST= process.env.MSSQL_HOST;
const MSSQL_USER= process.env.MSSQL_USER;
const MSSQL_PASSWORD= process.env.MSSQL_PASSWORD;
const MSSQL_DATABASE= process.env.MSSQL_DATABASE;
const MSSQL_PORT = process.env.MSSQL_PORT;

const DATABASE_ENGINE = process.env.DATABASE_ENGINE;

module.exports = {
    DATABASE_ENGINE,
    DB_URL,
    PORT,

    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,

    PG_HOST,
    PG_USER,
    PG_PASSWORD,
    PG_DATABASE,
    
    MSSQL_HOST,
    MSSQL_USER,
    MSSQL_PASSWORD,
    MSSQL_DATABASE,
    MSSQL_PORT,
  }