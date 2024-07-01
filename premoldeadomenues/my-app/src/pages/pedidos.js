

// src/pages/TasksPage.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/appcontext';

const TasksPage = () => {
  const { tasks, addTask, updateTaskStatus } = useContext(AppContext);
  const [taskName, setTaskName] = useState('');

  const handleAddTask = () => {
    addTask({ id: Date.now(), name: taskName, status: 'in progress' });
    setTaskName('');
  };

  return (
    <div>
      <h1>Tasks Page</h1>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.name} - {task.status}
            <button onClick={() => updateTaskStatus(task.id, 'completed')}>Complete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
