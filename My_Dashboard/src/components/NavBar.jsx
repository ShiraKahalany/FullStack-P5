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
        {user && <Link to={`/users/${user.id}/home`}>My Dashboard</Link>}
      </div>
      {user && (
        <div className="navbar-links">
          <Link to={`/users/${user.id}/info`}>Info</Link>
          <Link to={`/users/${user.id}/todos`}>Todos</Link>
          <Link to={`/users/${user.id}/posts`}>Posts</Link>
          <Link to={`/users/${user.id}/albums`}>Albums</Link>
        </div>
      )}
      {user && (
        <div className="navbar-user">
          <span>{user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
