const tasksRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

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
  
    const user = await User.findById(decodedToken.id)
    if (!user)
      return response.status(401).json({ error: 'token invalid or user deleted' })
  
    const tasks = await Task.find( {login : user.login});
  
    response.send({...tasks});
})
  
tasksRouter.post('/', async (request, response) => {
  
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
  
    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'token invalid or user deleted' })
    }
    const newTask = new Task({
      ...request.body,
      login: user.login
    })
  
    newTask.save().then(result => {
      response.send({id : newTask._id});
    })
})
  
tasksRouter.delete('/:taskId', async (request, response) => {
  
    const taskId = request.params.taskId;
  
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id)
      return response.status(401).json({ error: 'token invalid' })
  
    const user = await User.findById(decodedToken.id)
    if (!user)
      return response.status(401).json({ error: 'token invalid or user deleted' })

      Task.deleteOne({ _id: taskId })
  .then(result => {
    if (result.deletedCount === 1) {
      return response.status(204).end();
    } else {
      return response.status(404).json({ error: 'task not found' })
    }
  })
  .catch(error => {
    return response.status(500).json({ error: 'Internal Server Error', detailedError: error.message })
  });
})
  
  
tasksRouter.put('/:taskId', async (request, response) => {
  
    const taskId = request.params.taskId;
  


    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id)
      return response.status(401).json({ error: 'token invalid' })
  
    const user = await User.findById(decodedToken.id)
    if (!user)
      return response.status(401).json({ error: 'token invalid or user deleted' })

    const task = await Task.findById(taskId)
    if (!task || (task.login != user.login))
      return response.status(404).json({ error: 'task not found' })

     task.content = request.body.content;
     task.save().then(result => {
      response.send();
    })
})

module.exports = tasksRouter