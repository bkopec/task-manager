import React, { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
import config from '../config.js'
import Task from './Task.js'

const backendUrl = config.backendUrl;

function TaskList({user, tasks, setTasks}) {

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
        if (error.response.status == 401)
          return;
      });
    }, []);

    const handleDelete = (id) => {
        axios 
        .delete(backendUrl + '/api/tasks/' + id, { headers:{'Authorization': `Bearer ${user.token}` } })
        .then(response => {
            setTasks(tasks.filter((task) => task.id != id));
            console.log("success");
        })
        .catch(error => {
          console.log(error);
          if (error.response.status == 401)
            return;
        });
        console.log(id);
    };

    const handleEdit = (id, content) => {
        axios 
        .put(backendUrl + '/api/tasks/' + id, {content: content}, { headers:{'Authorization': `Bearer ${user.token}` } })
        .then(response => {
            setTasks(tasks.map((task) => task.id == id ? {...task, content:content} : task));
            console.log("success");
            return(true);
        })
        .catch(error => {
            console.log(error);
            if (error.response.status == 401)
            return(false);
        });
        console.log(id);
        return(false);
    }

    const handleEditing = (id) => {
        setTasks(tasks.map((task) => task.id == id ? {...task, editing:true} : task));
    }

    console.log(tasks);
    return(
      <div id="taskList">
        <h1>Task list :</h1>
        {tasks.map((task) => <Task key={task.id} task={task} onDelete={handleDelete} onEdit={handleEdit}  />)}
      </div>
    );
  }

  export default TaskList;