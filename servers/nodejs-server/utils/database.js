const config = require('./config'); // Adjust the path as needed

let Database;

switch (config.DATABASE_ENGINE) {
  case "MYSQL":
    Database = require('../database/mysql_database');
    break;
  case "MONGODB":
    Database = require('../database/mongodb_database');
    break;
  case "PGSQL":
    Database = require('../database/pgsql_database');
    break;
  case "MSSQL":
    Database = require('../database/mssql_database');
    break;
  default:
    throw new Error("Invalid database engine specified in config.");
}

module.exports = Database;