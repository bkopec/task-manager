import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'
import config from '../config.js'

const backendUrl = config.backendUrl;

function NewTaskForm({user, tasks, setTasks}) {
    const [newTask, setNewTask] = useState('')
    const elementRef = useRef(null);


    useEffect(() => {
      console.log('Component rendered');
    }, []);


    const handleInputChange = (event, setter) =>  {
      setter(event.target.innerText);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      if (newTask.length == 0)
        return;

      const postData = {};
      postData.content = newTask;
  
      axios
      .post(backendUrl + '/api/tasks', postData,  { headers:{'Authorization': `Bearer ${user.token}` } })
      .then(response => {
        console.log(response)
        setTasks([...tasks, {login:user.login, id:response.data.id, content:postData.content}]);
        elementRef.current.innerHTML = '';
        setNewTask('');
      })
      .catch(error => {
        if (error.response && error.response.status == 500) {
          const data = error.response.data;
        }
      });
      };
  
    return (
    <form id="newTask">
    <div ref={elementRef} className="textarea" contentEditable="true" onInput={(e) => handleInputChange(e, setNewTask)}></div>
    <button label="Task" onClick={handleSubmit} type="submit">ADD</button>
    </form>
    );
  }

  export default NewTaskForm;