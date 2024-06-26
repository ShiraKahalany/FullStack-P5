import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';
import '../css/Todos.css';

const Todos = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const [todos, setTodos] = useState([]);
  const [sortBy, setSortBy] = useState('serial');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchStatus, setSearchStatus] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/todos?userId=${userId}`);
        let userTodos = response.data;

        // Apply sorting
        switch (sortBy) {
          case 'performance':
            userTodos.sort((a, b) => a.completed - b.completed);
            break;
          case 'alphabetical':
            userTodos.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'random':
            userTodos.sort(() => Math.random() - 0.5);
            break;
          default:
            break;
        }

        // Apply search filters
        userTodos = userTodos.filter(todo => {
          return (searchTitle === '' || todo.title.includes(searchTitle)) &&
                 (searchStatus === 'all' || todo.completed === (searchStatus === 'completed'));
        });

        setTodos(userTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [userId, sortBy, searchTitle, searchStatus]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim() === '') {
      alert('Please enter a task title.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/todos');
      const allTodos = response.data;
      const maxId = allTodos.length > 0 ? Math.max(...allTodos.map(todo => todo.id)) : 0;
      const newTask = {
        userId: parseInt(userId),
        id: String(maxId + 1),
        title: newTaskTitle,
        completed: false
      };

      const postResponse = await axios.post('http://localhost:3000/todos', newTask);
      setTodos([...todos, postResponse.data]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  const handleTaskTitleChange = (event) => {
    setNewTaskTitle(event.target.value);
  };

  const handleSearchTitleChange = (event) => {
    setSearchTitle(event.target.value);
  };

  const handleSearchStatusChange = (event) => {
    setSearchStatus(event.target.value);
  };

  const handleStatusChange = async (taskId, completed) => {
    try {
      const taskToUpdate = todos.find(todo => todo.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = { ...taskToUpdate, completed };
      await axios.patch(`http://localhost:3000/todos/${taskId}`, updatedTask);

      setTodos(todos.map(todo => (todo.id === taskId ? updatedTask : todo)));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${taskId}`);
      setTodos(todos.filter(todo => todo.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
  };

  const handleEditTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleConfirmEdit = async () => {
    if (!editingTask) return;

    try {
      const updatedTask = { ...editingTask, title: editedTitle };
      await axios.patch(`http://localhost:3000/todos/${editingTask.id}`, updatedTask);

      setTodos(todos.map(todo => (todo.id === editingTask.id ? updatedTask : todo)));
      setEditingTask(null);
      setEditedTitle('');
    } catch (error) {
      console.error('Error updating task title:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditedTitle('');
  };

  return (
    <div className="todos-container">
      <h2>Todos List for {user.name}</h2>
      
      {/* Sort dropdown */}
      <div className="sort-container">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="serial">Serial</option>
          <option value="performance">Performance</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="random">Random</option>
        </select>
      </div>

      {/* Search fields */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTitle}
          onChange={handleSearchTitleChange}
        />
        <select value={searchStatus} onChange={handleSearchStatusChange}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>

      {/* Add new task */}
      <div className="add-task-container">
        <input
          type="text"
          placeholder="Enter task title"
          value={newTaskTitle}
          onChange={handleTaskTitleChange}
        />
        <button onClick={handleAddTask} className="add-task-button">Add Task</button>
      </div>

      {/* List of todos */}
      <ul className="todos-list">
        {todos.map((todo, index) => (
          <li key={todo.id} className="todo-item">
            <span className="todo-serial-number">{index + 1}.</span>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleStatusChange(todo.id, !todo.completed)}
            />
            <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
            <button onClick={() => handleEditTask(todo)} className="edit-button">Edit</button>
            <button onClick={() => handleDeleteTask(todo.id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>

      {/* Edit task modal */}
      {editingTask && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <input
              type="text"
              value={editedTitle}
              onChange={handleEditTitleChange}
            />
            <button onClick={handleConfirmEdit} className="confirm-button">OK</button>
            <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todos;
