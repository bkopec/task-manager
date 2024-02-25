require('dotenv').config()

const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const { Pool } = require('pg');

class Database {

  static async findTaskById(id) {
    try {
        const connection = await this.pool.connect();
  
        const result = await connection.query('SELECT * FROM tasks WHERE id = $1', [id]);
        const rows = result.rows;

        connection.release();
  
        return rows.length === 1 ? rows[0] : null;
      } catch (error) {
        console.error('Error finding user by ID:', error.message);
        throw error;
      }
  }

  static async findTasksByLogin(login) {
    try {
        const connection = await this.pool.connect();
  
        const result = await connection.query(
            'SELECT tasks.* FROM tasks JOIN users ON tasks.user_id = users.dbid WHERE users.login = $1',
            [String(login)]
          );
        connection.release();
        const rows = result.rows;

  
        return rows.length > 0 ? rows : {};
      } catch (error) {
        console.error('Error finding user by ID:', error.message);
        throw error;
      }
  }

  static async findUserById(id) {
    try {
        const connection = await this.pool.connect();
  
        const result = await connection.query('SELECT * FROM users WHERE dbid = $1', [id]);
        const rows = result.rows;

        connection.release();
  
        return rows.length === 1 ? rows[0] : null;
      } catch (error) {
        console.error('Error finding user by ID:', error.message);
        throw error;
      }
  }

  static async findUserByLogin(login) {
    try {

        const connection = await this.pool.connect();

        const result = await connection.query('SELECT * FROM users WHERE login = $1', [String(login)]);
        const rows = result.rows;

        connection.release();
  
        return rows.length === 1 ? rows[0] : null;
      } catch (error) {
        console.error('Error finding user by login:', error.message);
        throw error;
      }
  }


  static async createTask(task) {
    try {
        const connection = await this.pool.connect();

        const userResult = await connection.query(
        'SELECT dbid FROM users WHERE login = $1',
        [task.login]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const userId = userResult.rows[0].dbid;

      const result = await connection.query(
        'INSERT INTO tasks (id, user_id, content, completed) VALUES ($1, $2, $3, $4) RETURNING id',
        [uuidv4(), userId, task.content, false]
      );

      connection.release();
      return result.rows[0].id;

    } catch (error) {
      console.error('Error creating task:', error.message);
      throw error;
    }
  }

  static async createUser(user) {
    try {

      const connection = await this.pool.connect();

      const result = await connection.query(
        'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING dbid',
        [user.login, user.password]
      );

      connection.release();

      return result.rows[0].dbid;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }
  
 
  static async deleteTaskById(id) {
    try {
        const connection = await this.pool.connect();

        const result = await connection.query(
          'DELETE FROM tasks WHERE id = $1',
          [id]
        );
  
        connection.release();

        if (result.rowCount === 0) {
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
        const connection = await this.pool.connect();

        const result = await connection.query(
          'UPDATE tasks SET completed = NOT completed WHERE id = $1',
          [String(id)]
        );
  
        connection.release();

        if (result.rowCount === 0) {
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

  this.pool = new Pool({
    user: config.PG_USER,
    password: String(config.PG_PASSWORD),
    host: config.PG_HOST,
    database: config.PG_DATABASE,
    port: config.PG_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  const connection = await this.pool.connect();

  try {
    const usersTableResult = await connection.query(`SELECT table_name FROM information_schema.tables WHERE table_name = $1`, ['users']);

    if (usersTableResult.rows.length === 0) {
      await connection.query(`
        CREATE TABLE users (
          dbid SERIAL PRIMARY KEY,
          login VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL
        )
      `);
      console.log('Table "users" created.');
    }

    const tasksTableResult = await connection.query(`SELECT table_name FROM information_schema.tables WHERE table_name = $1`, ['tasks']);

    if (tasksTableResult.rows.length === 0) {
      await connection.query(`
        CREATE TABLE tasks (
          dbid SERIAL PRIMARY KEY,
          id UUID UNIQUE,
          user_id INTEGER,
          content VARCHAR(255),
          completed BOOLEAN,
          FOREIGN KEY (user_id) REFERENCES users(dbid)
        )
      `);
      console.log('Table "tasks" created.');
    }

    console.log('Connected to PostgreSQL');
  } finally {
    connection.release();
  }
} catch (error) {
  console.error('Error connecting to PostgreSQL:', error.message);
}
}
  
};

module.exports = Database;