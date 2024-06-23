import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './NavBar';
import AuthContext from '../contexts/AuthContext';
<<<<<<< HEAD
import '../css/Home.css';
=======
// import '../css/Home.css'; // Import the CSS for styling
>>>>>>> 67536add1f48c65c4c3cf50408e01d60378c709f

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname === '/home') {
      // Redirect to login if no user and on home page
      navigate('/login');
    } 
  }, [user, location, navigate]);

  // Render welcome message and user's name only on the home page
  const renderWelcome = location.pathname === '/home';

  return (
    <div>
      <Navbar />
      <main className="home-main">
        {renderWelcome && (
          <div className="welcome-container">
            <h1>Welcome</h1>
            <div className="animated-name">
              {user && (
                user.name.split('').map((char, index) => (
                  <span key={index} className="letter" style={{ animationDelay: `${index * 0.1}s` }}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))
              )}
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
