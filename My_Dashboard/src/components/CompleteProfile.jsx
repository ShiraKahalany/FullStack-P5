import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';
import '../css/CompleteProfile.css'; // Import the CSS file

const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, password } = location.state || {};
  const { setUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      geo: {
        lat: '',
        lng: ''
      }
    },
    phone: '',
    company: {
      name: '',
      catchPhrase: '',
      bs: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split('.');

    if (subfield) {
      setProfileData({
        ...profileData,
        [field]: {
          ...profileData[field],
          [subfield]: value
        }
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const completeUserData = {
      username,
      password, // Save the password for login purposes
      ...profileData
    };

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completeUserData)
      });
      const userData = await response.json();

      // Simulate login by fetching the user and setting it in context and local storage
      const loginResponse = await axios.get(`http://localhost:3000/users?username=${username}`);
      const user = loginResponse.data[0];

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      navigate(`/users/${user.id}/home`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to complete registration');
    }
  };

  return (
    <div className="complete-profile-page">
      <main role="main" className="main">
        <h1>Complete Profile</h1>
        <h3>Please fill in the details to complete your profile.</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={profileData.name} onChange={handleChange} required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={profileData.email} onChange={handleChange} required />

          <label htmlFor="street">Street:</label>
          <input type="text" id="street" name="address.street" value={profileData.address.street} onChange={handleChange} />

          <label htmlFor="suite">Suite:</label>
          <input type="text" id="suite" name="address.suite" value={profileData.address.suite} onChange={handleChange} />

          <label htmlFor="city">City:</label>
          <input type="text" id="city" name="address.city" value={profileData.address.city} onChange={handleChange} />

          <label htmlFor="zipcode">Zipcode:</label>
          <input type="text" id="zipcode" name="address.zipcode" value={profileData.address.zipcode} onChange={handleChange} />

          <label htmlFor="lat">Latitude:</label>
          <input type="text" id="lat" name="address.geo.lat" value={profileData.address.geo.lat} onChange={handleChange} />

          <label htmlFor="lng">Longitude:</label>
          <input type="text" id="lng" name="address.geo.lng" value={profileData.address.geo.lng} onChange={handleChange} />

          <label htmlFor="phone">Phone:</label>
          <input type="text" id="phone" name="phone" value={profileData.phone} onChange={handleChange} />

          <label htmlFor="companyName">Company Name:</label>
          <input type="text" id="companyName" name="company.name" value={profileData.company.name} onChange={handleChange} />

          <label htmlFor="catchPhrase">Catch Phrase:</label>
          <input type="text" id="catchPhrase" name="company.catchPhrase" value={profileData.company.catchPhrase} onChange={handleChange} />

          <label htmlFor="bs">BS:</label>
          <input type="text" id="bs" name="company.bs" value={profileData.company.bs} onChange={handleChange} />

          <div className="wrap">
            <button type="submit" id="completeProfileSubmit" name="completeProfileSubmit" className="submit-button">
              Complete Registration
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CompleteProfile;
