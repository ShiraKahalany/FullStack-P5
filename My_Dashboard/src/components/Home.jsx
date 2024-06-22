// src/components/Home/Home.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import AuthContext from '../contexts/AuthContext';
// import '../css/Home.css'; // Import the CSS for styling

const Home = () => {
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
