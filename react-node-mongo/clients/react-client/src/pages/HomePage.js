import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import TaskList from '../components/TaskList';
import NewTaskForm from "../components/NewTaskForm";


function HomePage({user, setUser}) {
    const [tasks, setTasks] = useState(null);
    return (
      <div>
        <Header />
        <main>
          <NewTaskForm user={user} tasks={tasks} setTasks={setTasks} />
          <TaskList user={user} setUser={setUser} tasks={tasks} setTasks={setTasks} />
        </main>
      </div>
    )
  }

  export default HomePage;