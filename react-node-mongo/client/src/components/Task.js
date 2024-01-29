import React, { useState } from 'react';

function Task({task, onDelete, onEdit}) {
    const [editing, setEditing] = useState(false);
    const [newContent, setNewContent] = useState(task.content);

    const handleEdit = (id) => {
        setEditing(true);
    }

    return (
      <div className="task">
        {!editing &&
        <p>{task.content}</p>}
        {editing &&
        <textarea type="textarea" cols="50" rows="2" value={newContent} onChange={(e) => setNewContent(e.target.value)} />}
        {!editing &&
        <button onClick={() => handleEdit(task.id)}>Edit</button>}
        {!editing &&
        <button onClick={() => onDelete(task.id)}>Delete</button>}
        {editing && 
        <button onClick={() => setEditing(onEdit(task.id, newContent))}>Submit</button>}
    </div>
    )
}

export default Task;