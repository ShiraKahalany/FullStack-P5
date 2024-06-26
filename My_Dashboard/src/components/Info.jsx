// src/components/Info.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import '../css/Info.css';

const Info = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      const localStorageUser = localStorage.getItem('user');
      if (localStorageUser) {
        const parsedUser = JSON.parse(localStorageUser);
        setUserInfo(parsedUser);
      }
    }
  }, [user, userId]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="info-page">
      <div className="info-container">
        <h2>{userInfo.name}'s Information</h2>
        <div className="info-section">
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Phone:</strong> {userInfo.phone}</p>
          <p><strong>Website:</strong> <a href={`http://${userInfo.website}`} target="_blank" rel="noopener noreferrer">{userInfo.website}</a></p>
        </div>
        <div className="info-section">
          <h3>Address</h3>
          <p>{userInfo.address.street}, {userInfo.address.suite}</p>
          <p>{userInfo.address.city}, {userInfo.address.zipcode}</p>
        </div>
        <div className="info-section">
          <h3>Company</h3>
          <p><strong>Name:</strong> {userInfo.company.name}</p>
          <p><strong>Catch Phrase:</strong> {userInfo.company.catchPhrase}</p>
          <p><strong>BS:</strong> {userInfo.company.bs}</p>
        </div>
      </div>
    </div>
  );
};

export default Info;
