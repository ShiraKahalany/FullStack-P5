// src/components/NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavBar.css'; // Import the CSS for styling

function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">My Dashboard</Link>
      </div>
      <div className="navbar-links">
        <Link to="/home/info">Info</Link>
        <Link to="/home/todos" >Todos</Link>
        <Link to="/home/posts">Posts</Link>
        <Link to="/home/albums">Albums</Link>
      </div>
      {user && (
        <div className="navbar-user">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
