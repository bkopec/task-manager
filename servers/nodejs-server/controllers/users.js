const usersRouter = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../utils/config')

Database = require('../utils/database.js');


function generateToken(userForToken) {
    return jwt.sign(userForToken, process.env.SECRET);
}

usersRouter.post('/', async (request, response) => {
  
    if (request.body.password.length < 4)
      return(response.status(500).json({ error: 'Internal Server Error', detailedError: "Forged request or old client" }));
  
    const user = await Database.findUserByLogin(request.body.login);

    if (user) {
      const passwordCorrect = await bcrypt.compare(request.body.password, user.password);
  
      if (!passwordCorrect) {
        return response.status(401).json({
          errorMessage: 'Username exists - invalid password.', error:"INVALID_PASSWORD"
        })
      }
      else {
        const token = generateToken({login: user.login, id: user._id});
        return(response.status(200).send({token, login: user.login}));
      }
    }
  
    // user doesn't exist, create the user
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds);

    Database.createUser({login : request.body.login, password : passwordHash}).then(async result => {
      const userForToken = {
        login: request.body.login,
        id: result
      }
      const token = jwt.sign(userForToken, process.env.SECRET)
    
      response.status(200).send({token, login: request.body.login});
    }).catch(error => {
      console.error('Error saving account:', error);
  
      response.status(500).json({ error: 'Internal Server Error', detailedError: error.message });
    });

  })

module.exports = usersRouter