import React, { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
import config from '../config.js'
import Task from './Task.js'
import Cookies from 'universal-cookie';
import loadingImage from '../assets/loading.webp';

const backendUrl = config.backendUrl;

function TaskList({user, setUser, tasks, setTasks}) {

    useEffect(() => {
      axios 
      .get(backendUrl + '/api/tasks', { headers:{'Authorization': `Bearer ${user.token}` } })
      .then(response => {
        let fetchedTasks = [];
        
        Object.keys(response.data).forEach(function(key) {
          fetchedTasks.push(response.data[key]);
        })
        setTasks(fetchedTasks);
      })
      .catch(error => {
        console.log(error);
        if (error.response.status == 401) {
          setUser({});
          const cookies = new Cookies();
          cookies.remove("jwt-token");
          cookies.remove("login");
        }
      });
    }, []);

    const handleDelete = (id) => {
        axios 
        .delete(backendUrl + '/api/tasks/' + id, { headers:{'Authorization': `Bearer ${user.token}` } })
        .then(response => {
            setTasks(tasks.filter((task) => task.id != id && task.deleting == undefined));
        })
        .catch(error => {
          console.log(error);
          if (error.response && error.response.status == 401)
            return;
        });
    };

    const handleCompleted = (id) => {
      axios 
      .put(backendUrl + '/api/tasks/' + id, {id}, { headers:{'Authorization': `Bearer ${user.token}` } })
      .then(response => {
          setTasks(tasks.map((task) => task.id === id ? {...task, completed: !task.completed} : task));
      })
      .catch(error => {
        console.log(error);
        if (error.response && error.response.status == 401)
          return;
      });
    }

    console.log(tasks);
    return(
      <div id="taskList">
         {tasks && tasks.length == 0 && 
        <p className="emptyTaskList">No tasks yet</p>}
        {tasks && tasks.length > 0 &&
        tasks.map((task) => <Task key={task.id} task={task} onDelete={handleDelete} onCompleted={handleCompleted} />)}
        {!tasks &&
        <img className="loading fade-in" src={loadingImage} />}
      </div>
    );
  }

  export default TaskList;