import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from './NavBar';
import AuthContext from '../contexts/AuthContext';
import '../css/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { userId } = useParams();
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      // Redirect to login if no user
      navigate('/login');
    } else {
      setIsUserLoaded(true);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isUserLoaded && location.pathname === `/users/${userId}/home`) {
      setIsUserLoaded(true);
    }
  }, [location.pathname, userId, isUserLoaded]);

  // Render welcome message and user's name only on the user-specific home page
  const renderWelcome = location.pathname === `/users/${userId}/home` && isUserLoaded;

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
