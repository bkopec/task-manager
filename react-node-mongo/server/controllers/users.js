const usersRouter = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function generateToken(userForToken) {
    return jwt.sign(userForToken, process.env.SECRET);
}

usersRouter.post('/', async (request, response) => {
    const newUser = new User({
      ...request.body
    })
  
    if (newUser.password.length < 4)
      return(response.status(500).json({ error: 'Internal Server Error', detailedError: "Forged request or old client" }));
  
    const user = await User.findOne({ login: newUser.login });
  
    if (user) {
      const passwordCorrect = await bcrypt.compare(newUser.password, user.password);
  
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
  
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = passwordHash;
  
    newUser.save().then(async result => {
      const userForToken = {
        login: newUser.login,
        id: newUser._id,
      }     
      const token = jwt.sign(userForToken, process.env.SECRET)
    
      response.status(200).send({token, login: newUser.login});
    }).catch(error => {
      console.error('Error saving account:', error);
  
      response.status(500).json({ error: 'Internal Server Error', detailedError: error.message });
    });
  })

module.exports = usersRouter