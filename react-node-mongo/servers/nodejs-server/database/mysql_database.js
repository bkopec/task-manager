require('dotenv').config()

const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

class Database {

  static async findTaskById(id) {
    try {
        const connection = await this.pool.getConnection();
  
        const [rows] = await connection.execute('SELECT * FROM tasks WHERE id = ?', [id]);
  
        connection.release();
  
        return rows.length === 1 ? rows[0] : null;
      } catch (error) {
        console.error('Error finding user by ID:', error.message);
        throw error;
      }
  }

  static async findTasksByLogin(login) {
    try {
        const connection = await this.pool.getConnection();
  
        const [rows] = await connection.execute(
            'SELECT tasks.* FROM tasks JOIN users ON tasks.user_id = users.dbid WHERE users.login = ?',
            [String(login)]
          );
  
        connection.release();
  
        return rows.length > 0 ? rows : {};
      } catch (error) {
        console.error('Error finding user by ID:', error.message);
        throw error;
      }
  }

  static async findUserById(id) {
    try {
        const connection = await this.pool.getConnection();
  
        const [rows] = await connection.execute('SELECT * FROM users WHERE dbid = ?', [id]);
  
        connection.release();
  
        return rows.length === 1 ? rows[0] : null;
      } catch (error) {
        console.error('Error finding user by ID:', error.message);
        throw error;
      }
  }

  static async findUserByLogin(login) {
    try {
        const connection = await this.pool.getConnection();
  
        const [rows] = await connection.execute('SELECT * FROM users WHERE login = ?', [String(login)]);

        connection.release();
  
        return rows.length === 1 ? rows[0] : null;
      } catch (error) {
        console.error('Error finding user by login:', error.message);
        throw error;
      }
  }


  static async createTask(task) {
    try {
        const connection = await this.pool.getConnection();

        const [userResult] = await connection.execute(
        'SELECT dbid FROM users WHERE login = ?',
        [task.login]
      );

      if (userResult.length === 0) {
        throw new Error('User not found');
      }

      const userId = userResult[0].dbid;

      const [result] = await connection.execute(
        'INSERT INTO tasks (id, user_id, content, completed) VALUES (?, ?, ?, ?)',
        [uuidv4(), userId, task.content, false]
      );

      return result.insertId;

    } catch (error) {
      console.error('Error creating task:', error.message);
      throw error;
    }
  }

  static async createUser(user) {
    try {

      const connection = await this.pool.getConnection();

      const [result] = await connection.execute(
        'INSERT INTO users (login, password) VALUES (?, ?)',
        [user.login, user.password]
      );

      connection.release();

      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }
  
 
  static async deleteTaskById(id) {
    try {
        const connection = await this.pool.getConnection();

        const [result] = await connection.execute(
          'DELETE FROM tasks WHERE id = ?',
          [id]
        );
  
        if (result.affectedRows === 0) {
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
        const connection = await this.pool.getConnection();

        const [result] = await connection.execute(
          'UPDATE tasks SET completed = !completed WHERE id = ?',
          [String(id)]
        );
  
        if (result.affectedRows === 0) {
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

    const tempConnection = await mysql.createConnection({
        host: config.MYSQL_HOST,
        user: config.MYSQL_USER,
        password: config.MYSQL_PASSWORD,
      });

      // Check if the database exists
      const [rows] = await tempConnection.execute(`SHOW DATABASES LIKE '${config.MYSQL_DATABASE}'`);

      if (rows.length === 0) {
        // Database does not exist, create it
        await tempConnection.execute(`CREATE DATABASE ${config.MYSQL_DATABASE}`);
        console.log(`Database ${config.MYSQL_DATABASE} created.`);
      }

      // Close the temporary connection
      tempConnection.end();


    this.pool = mysql.createPool({
        host: config.MYSQL_HOST,
        user: config.MYSQL_USER,
        password: config.MYSQL_PASSWORD,
        database: config.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
  

      try {
        const connection = await this.pool.getConnection();

        const [usersTableRows] = await connection.execute(`SHOW TABLES LIKE 'users'`);

        if (usersTableRows.length === 0) {
          await connection.execute(`
            CREATE TABLE users (
              dbid INT AUTO_INCREMENT PRIMARY KEY,
              login VARCHAR(255) NOT NULL,
              password VARCHAR(255) NOT NULL
            )
          `);
          console.log('Table "users" created.');
        }

        const [tasksTableRows] = await connection.execute(`SHOW TABLES LIKE 'tasks'`);

        if (tasksTableRows.length === 0) {
          await connection.execute(`
            CREATE TABLE tasks (
              dbid INT AUTO_INCREMENT PRIMARY KEY,
              id VARCHAR(36) UNIQUE,
              user_id INT,
              content VARCHAR(255),
              completed BOOLEAN,
              FOREIGN KEY (user_id) REFERENCES users(dbid)
            )
          `);
          console.log('Table "tasks" created.');
        }

        console.log('Connected to MySQL');

        connection.release();
      } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
      }
  }
  
};

module.exports = Database;