const tasksRouter = require('express').Router()

const jwt = require('jsonwebtoken')

const config = require('../utils/config')

let Database;
if (config.DATABASE_ENGINE == "MYSQL")
  Database = require('../database/mysql_database');
else if (config.DATABASE_ENGINE == "MONGODB")
  Database = require('../database/mongodb_database');
else if (config.DATABASE_ENGINE == "PGSQL")
  Database = require('../database/pgsql_database');
else if (config.DATABASE_ENGINE == "MSSQL")
  Database = require('../database/mssql_database');


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

tasksRouter.get('/', async (request, response) => {

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id)
      return response.status(401).json({ error: 'token invalid' })
  
    const user = await Database.findUserById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'token invalid or user deleted' });
    }
     
    const tasks = await Database.findTasksByLogin(user.login);
  
    response.send({...tasks});
})
  
tasksRouter.post('/', async (request, response) => {
  
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await Database.findUserById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'token invalid or user deleted' })
    }

    Database.createTask({...request.body, login: user.login})
    .then(result => {
      return response.status(200).send({id : result});
    })
    .catch(error => {
      console.error('Error saving task:', error);
      return response.status(500).json({ error: 'Internal Server Error', detailedError: error.message });
    });
})
  
tasksRouter.delete('/:taskId', async (request, response) => {
  
    const taskId = request.params.taskId;
  
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id)
      return response.status(401).json({ error: 'token invalid' })
  
    const user = await Database.findUserById(decodedToken.id)
    if (!user)
      return response.status(401).json({ error: 'token invalid or user deleted' })

      Database.deleteTaskById(taskId)
  .then(result => {
      return response.status(204).end();
  })
  .catch(error => {
    return response.status(500).json({ error: 'Internal Server Error', detailedError: error.message })
  });
})
  
  
tasksRouter.put('/:taskId', async (request, response) => {

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id)
      return response.status(401).json({ error: 'token invalid' })
  
    const user = await Database.findUserById(decodedToken.id)
    if (!user)
      return response.status(401).json({ error: 'token invalid or user deleted' })

    Database.updateTaskCompletion(request.body.id)
    .then(result => {
      response.send();
    })
    .catch(error => {
      console.error('Error updating task:', error);
      return response.status(500).json({ error: 'Internal Server Error', detailedError: error.message });
    });
})

module.exports = tasksRouter