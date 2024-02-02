require('dotenv').config()

const { v4: uuidv4 } = require('uuid');

const sql = require('mssql')

class Database {

  static async findTasksByLogin(login) {
    try {
      const request = this.pool.request();

      const result = await request
        .input('login', sql.NVarChar, login)
        .query(`
          SELECT tasks.*
          FROM tasks
          JOIN users ON tasks.user_id = users.dbid
          WHERE users.login = @login
        `);

      return result.recordset;
    } catch (error) {
      console.error('Error finding tasks by login:', error.message);
      throw error;
    }
  }

  static async findUserById(id) {
    try {
      const request = this.pool.request();

      const result = await request
        .input('id', sql.Int, parseInt(id))
        .query('SELECT * FROM users WHERE dbid = @id');

        if (result.recordset.length != 1)
          return(null);


        let user = {...result.recordset[0]};
        user._id = user.dbid;
        delete user.dbid;
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error.message);
      throw error;
    }
  }

  static async findUserByLogin(login) {
    try {
      const result = await this.pool
        .request()
        .input('login', sql.NVarChar, login)
        .query('SELECT * FROM users WHERE login = @login');
  
       if (result.recordset.length != 1)
        return(null);

        let user = {...result.recordset[0]};
        user._id = user.dbid;
        delete user.dbid;
        return user;
    } catch (error) {
      console.error('Error finding user by login:', error.message);
      throw error;
    }
  }


  static async createTask(task) {
    try {
      const request = this.pool.request();
  
      const userResult = await request
        .input('login', sql.NVarChar, task.login)
        .query('SELECT dbid FROM users WHERE login = @login');
  
      if (userResult.recordset.length === 0) {
        throw new Error('User not found');
      }
  
      const userId = userResult.recordset[0].dbid;

      const result = await request
        .input('id', sql.NVarChar, uuidv4())
        .input('user_id', sql.Int, userId)
        .input('content', sql.NVarChar, task.content)
        .input('completed', sql.Bit, false)
        .query('INSERT INTO tasks (id, user_id, content, completed) OUTPUT INSERTED.id VALUES (@id, @user_id, @content, @completed)');
  
      return result.recordset[0].id;
    } catch (error) {
      console.error('Error creating task:', error.message);
      throw error;
    }
  }

  static async createUser(user) {
    try {
  
      const result = await this.pool
        .request()
        .input('login', sql.NVarChar, user.login)
        .input('password', sql.NVarChar, user.password)
        .query('INSERT INTO users (login, password) OUTPUT INSERTED.dbid VALUES (@login, @password)');
  
      if (result.rowsAffected.length === 0) {
        throw new Error('User not created');
      }
  
      return result.recordset[0].dbid;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }
  
 
  static async deleteTaskById(id) {
    try {
      const result = await this.pool
        .request()
        .input('id', sql.VarChar(36), id)
        .query('DELETE FROM tasks WHERE id = @id');

      if (result.rowsAffected[0] === 0) {
        throw new Error('Task not found');
      }

      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error.message);
      throw error;
    }
  }

  static async updateTaskCompletion(id) {
    try {
      const pool = await this.pool;
      const request = pool.request();

      const result = await request
        .input('id', sql.NVarChar, id)
        .query('UPDATE tasks SET completed = ~completed WHERE id = @id');

      if (result.rowsAffected[0] === 0) {
        throw new Error('Task not found');
      }

      console.log('Task marked as completed successfully');
    } catch (error) {
      console.error('Error marking task as completed:', error.message);
      throw error;
    }
  }


  static async init() {
    const config = require('../utils/config');

    try {
    const connectionString = `Server=${config.MSSQL_HOST},${config.MSSQL_PORT};Database=master;User Id=${config.MSSQL_USER};Password=${config.MSSQL_PASSWORD};TrustServerCertificate=True;`;

    this.pool = new sql.ConnectionPool(connectionString);

    await this.pool.connect();

    const checkDatabaseResult = await this.pool.request()
    .query(`IF DB_ID(\'${config.MSSQL_DATABASE}\') IS NULL SELECT 0 AS DatabaseExists ELSE SELECT 1 AS DatabaseExists`);

    const databaseExists = checkDatabaseResult.recordset[0].DatabaseExists;
      console.log(databaseExists)

    if (databaseExists === 0) {
      await this.pool.request()
        .query(`CREATE DATABASE ${config.MSSQL_DATABASE};`);

      console.log(`Database ${config.MSSQL_DATABASE} created.`);
    }

    await this.pool.request()
    .query(`USE ${config.MSSQL_DATABASE};`);

    console.log(`Using ${config.MSSQL_DATABASE} as current db.`)

    const usersTableResult = await this.pool.request()
      .query(`IF OBJECT_ID('users', 'U') IS NULL
              CREATE TABLE users (
                  dbid INT IDENTITY(1,1) PRIMARY KEY,
                  login NVARCHAR(255) NOT NULL,
                  password NVARCHAR(255) NOT NULL
              )`);



  // Create tasks table if not exists
    const tasksTableResult = await this.pool.request()
      .query(`IF OBJECT_ID('tasks', 'U') IS NULL
              CREATE TABLE tasks (
                  dbid INT IDENTITY(1,1) PRIMARY KEY,
                  id UNIQUEIDENTIFIER DEFAULT NEWID(),
                  user_id INT,
                  content NVARCHAR(255),
                  completed BIT,
                  FOREIGN KEY (user_id) REFERENCES users(dbid)
              )`);

    } catch (error) {
      throw error;
    }

}

};

module.exports = Database;