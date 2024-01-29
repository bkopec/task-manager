import React, { useState } from 'react';
import axios from 'axios'
import config from '../config.js'

const backendUrl = config.backendUrl;

function NewTaskForm({user, tasks, setTasks}) {
    const [newTask, setNewTask] = useState('')
  
    const handleInputChange = (event, setter) =>  {
      setter(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      const postData = {};
      postData.content = newTask;
  
      axios
      .post(backendUrl + '/api/tasks', postData,  { headers:{'Authorization': `Bearer ${user.token}` } })
      .then(response => {
        console.log(response)
        setTasks([...tasks, {login:user.login, id:response.data.id, content:postData.content}]);
        setNewTask('');
      })
      .catch(error => {
        if (error.response.status == 500) {
          const data = error.response.data;
        }
      });
      };
  
    return (
    <form id="newTask">
      <h1>New task :</h1>
    <textarea type="textarea" cols="50" rows="4" value={newTask} onChange={(e) => handleInputChange(e, setNewTask)} />
    <button label="Task" onClick={handleSubmit} type="submit">Submit</button>
    </form>
    );
  }

  export default NewTaskForm;