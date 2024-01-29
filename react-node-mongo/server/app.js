
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const cors = require('cors')
const config = require('./utils/config')

const app = express()
app.use(cors())
app.use(express.json())

const middleware = require('./utils/middleware')

const tasksRouter = require('./controllers/tasks')
const usersRouter = require('./controllers/users')

app.use('/api/tasks', tasksRouter)
app.use('/api/users', usersRouter)

const url = config.DB_URL;

mongoose.set('strictQuery',false)
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const User = require('./models/user')
const Task = require('./models/task')

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