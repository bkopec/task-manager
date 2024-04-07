const tasksRouter = require('express').Router()

const jwt = require('jsonwebtoken')

const config = require('../utils/config')

const { authenticateUser, checkTaskOwnership} = require('../utils/middleware');


Database = require('../utils/database.js');

tasksRouter.get('/', authenticateUser, async (request, response) => {

  const user = request.user;
     
    const tasks = await Database.findTasksByLogin(user.login);
    response.send({...tasks});
})
  
tasksRouter.post('/', authenticateUser, async (request, response) => {
  
  const user = request.user;

    Database.createTask({...request.body, login: user.login})
    .then(result => {
      return response.status(200).send({id : result});
    })
    .catch(error => {
      console.error('Error saving task:', error);
      return response.status(500).json({ error: 'Internal Server Error', detailedError: error.message });
    });
})
  
tasksRouter.delete('/:taskId', authenticateUser, checkTaskOwnership, async (request, response) => {
  
    const taskId = request.params.taskId;

      Database.deleteTaskById(taskId)
  .then(result => {
      return response.status(204).end();
  })
  .catch(error => {
    return response.status(500).json({ error: 'Internal Server Error', detailedError: error.message })
  });
})
  
  
tasksRouter.put('/:taskId', authenticateUser, checkTaskOwnership, async (request, response) => {

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