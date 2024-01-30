import { useState, useRef, useEffect } from "react";
import TaskList from '../components/TaskList';
import NewTaskForm from "../components/NewTaskForm";

function HomePage({user, setUser}) {
    const [tasks, setTasks] = useState(null);
    return (
      <div>
        <header>
          <h1>TASK MANAGER</h1>
        </header>
        <main>
          <NewTaskForm user={user} tasks={tasks} setTasks={setTasks} />
          <TaskList user={user} setUser={setUser} tasks={tasks} setTasks={setTasks} />
        </main>
      </div>
    )
  }

  export default HomePage;