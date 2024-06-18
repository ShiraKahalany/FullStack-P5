// src/components/Home.jsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <header>
        <h1>Welcome, {user.name}</h1>
        <nav>
          <Link to="info">Info</Link>
          <Link to="todos">Todos</Link>
          <Link to="posts">Posts</Link>
          <Link to="albums">Albums</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Home;
