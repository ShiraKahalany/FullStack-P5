import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import '../css/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:3000/users?username=${username}`);
      const user = response.data[0];
      if (user && user.website === password) {
        // console.log('User logged in:', user);
        // console.log(user.website);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/home');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <main role="main" className="main">
        <h1>Sign In</h1>
        <h3>Please sign in to continue.</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Username"
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
            required
          />
          <div className="wrap">
            <button type="submit" id="signinSubmit" name="signinSubmit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
        <p>Don't have an account? <a href="/register">Create new one</a></p>
      </main>
    </div>
  );
};

export default Login;
