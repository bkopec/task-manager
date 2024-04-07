
const express = require('express')
require('dotenv').config()

const cors = require('cors')
const config = require('./utils/config')

const app = express()
app.use(cors())
app.use(express.json())

Database = require('./utils/database.js');
Database.init();

const middleware = require('./utils/middleware')

const tasksRouter = require('./controllers/tasks')
const usersRouter = require('./controllers/users')

app.use('/api/tasks', tasksRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = config.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

process.on('SIGINT', function() {
  process.exit(0);
});

module.exports = app