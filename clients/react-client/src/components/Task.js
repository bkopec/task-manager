import React, { useState } from 'react';
import deleteImage from '../assets/cross.png';

function Task({task, onDelete, onCompleted}) {

    const [isDeleted, setIsDeleted] = useState(false);


    const handleCheckboxChange = () => {
        onCompleted(task.id);
      };

    const handleDelete = () => {
        // mutating state directly to handle rapid deletion
        task.deleting = true;
        setIsDeleted(true);
        setTimeout(() => {
            onDelete(task.id);
            console.log(task.id);
          }, 600);
    };

    return (
      <div className={"task " + (isDeleted ? "invisible" : "fade-in")} >
        <input type="checkbox" onChange={handleCheckboxChange} checked={task.completed ? "checked" : ""}/>
        <p className={task.completed ? "checked" : ""}>{task.content}</p>
        <img className="deleteButton" src={deleteImage} onClick={handleDelete}/>
    </div>
    );
}

export default Task;