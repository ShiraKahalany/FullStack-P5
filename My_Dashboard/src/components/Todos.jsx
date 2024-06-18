// src/components/Todos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Todos() {
  const [todos, setTodos] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get(`http://localhost:5000/todos?userId=${user.id}`);
      setTodos(response.data);
    };
    fetchTodos();
  }, [user.id]);

  return (
    <div>
      <h2>Your Todos</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} readOnly />
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
