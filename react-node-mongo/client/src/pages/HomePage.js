import { useState, useRef, useEffect } from "react";
import TaskList from '../components/TaskList';
import NewTaskForm from "../components/NewTaskForm";

function HomePage({user, setUser}) {
    const [tasks, setTasks] = useState([]);
    return (
      <div>
        <h1>Home</h1>
        <NewTaskForm user={user} tasks={tasks} setTasks={setTasks} />
        <TaskList user={user} tasks={tasks} setTasks={setTasks} />
      </div>
    )
  }

  export default HomePage;