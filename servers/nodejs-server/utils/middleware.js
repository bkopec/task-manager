const logger = require('./logger')

const jwt = require('jsonwebtoken');

Database = require('./database.js');

const checkTaskOwnership = async (request, response, next) => {
  const taskId = request.params.taskId;
  const user = request.user;

  const task = await Database.findTaskById(taskId);
  if (!task) {
    return response.status(404).json({ error: 'task not found' });
  }

  if (task.login !== user.login) {
    return response.status(403).json({ error: 'forbidden' });
  }

  next();
}

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

const authenticateUser = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token invalid' });
    }

    const user = await Database.findUserById(decodedToken.id);
    if (!user) {
      return response.status(401).json({ error: 'Token invalid or user deleted' });
    }

    request.user = user;
    next();
  } catch (error) {
    next(error); 
  }
};

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  next(error)
}

module.exports = {
  checkTaskOwnership,
  authenticateUser,
  requestLogger,
  unknownEndpoint,
  errorHandler
}