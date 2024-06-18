// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== passwordVerify) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/users?username=${username}`);
      if (response.data.length > 0) {
        alert('Username already exists');
        return;
      }

      const newUser = {
        username,
        website: password
      };

      await axios.post('http://localhost:5000/users', newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      navigate('/home');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Verify Password"
          value={passwordVerify}
          onChange={(e) => setPasswordVerify(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
