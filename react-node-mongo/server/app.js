
const express = require('express')
require('dotenv').config()

const cors = require('cors')
const config = require('./utils/config')

const app = express()
app.use(cors())
app.use(express.json())

let Database;
if (config.DATABASE_ENGINE == "MYSQL")
  Database = require('./database/mysql_database');
else if (config.DATABASE_ENGINE == "MONGODB")
  Database = require('./database/mongodb_database');
else if (config.DATABASE_ENGINE == "PGSQL")
  Database = require('./database/pgsql_database');
Database.init();

const middleware = require('./utils/middleware')

const tasksRouter = require('./controllers/tasks')
const usersRouter = require('./controllers/users')

app.use('/api/tasks', tasksRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

process.on('SIGINT', function() {
  process.exit(0);
});

module.exports = app