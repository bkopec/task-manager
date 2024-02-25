require('dotenv').config()
const Task = require('../models/task');
const User = require('../models/user');

class Database {

  static async findTaskById(id) {
    return Task.findById(id);
  }

  static async findTasksByLogin(login) {
    return Task.find({login: login});
  }

  static async findUserById(id) {
    return User.findById(id);
  }

  static async findUserByLogin(login) {
    return User.findOne({login: login});
  }


  static async createTask(task) {
    const newTask = new Task({
        ...task
    })
  
    try {
        await newTask.save();
        return (newTask._id);
      } catch (error) {
        throw error;
      }

  }

  static async createUser(user) {
    const newUser = new User({
        ...user
    })
  
    try {
        await newUser.save();
        return (newUser._id);
    } catch (error) {
        throw error;
    }
  }
 
  static async deleteTaskById(id) {
    try {
        await Task.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }  
  }

  static async updateTaskCompletion(id) {
    const task = await Task.findById(id);
    task.completed = !task.completed;
    try {
        await task.save();
    }
    catch (error) {
        throw error;
    }
  }

  static async init() {
    const config = require('../utils/config');
    const url = config.DB_URL;

    const mongoose = require('mongoose')
    mongoose.set('strictQuery',false)
    mongoose.connect(url)
    .then(() => {
    console.log('Connected to MongoDB');
    })
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    });
  }
  
}

module.exports = Database;