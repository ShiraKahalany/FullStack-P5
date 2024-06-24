import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const completeUserData = {
      username,
      website: password, // Set the website field to the password
      ...profileData
    };

    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(completeUserData)
    })
    .then(response => response.json())
    .then(data => {
        setUser(username);
        localStorage.setItem('user', JSON.stringify(username));
        navigate('/login');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Failed to complete registration');
    });
  };

  return (
    <div>
      <h2>Complete Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={profileData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={profileData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Street:</label>
          <input type="text" name="address.street" value={profileData.address.street} onChange={handleChange} />
        </div>
        <div>
          <label>Suite:</label>
          <input type="text" name="address.suite" value={profileData.address.suite} onChange={handleChange} />
        </div>
        <div>
          <label>City:</label>
          <input type="text" name="address.city" value={profileData.address.city} onChange={handleChange} />
        </div>
        <div>
          <label>Zipcode:</label>
          <input type="text" name="address.zipcode" value={profileData.address.zipcode} onChange={handleChange} />
        </div>
        <div>
          <label>Latitude:</label>
          <input type="text" name="address.geo.lat" value={profileData.address.geo.lat} onChange={handleChange} />
        </div>
        <div>
          <label>Longitude:</label>
          <input type="text" name="address.geo.lng" value={profileData.address.geo.lng} onChange={handleChange} />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={profileData.phone} onChange={handleChange} />
        </div>
        <div>
          <label>Company Name:</label>
          <input type="text" name="company.name" value={profileData.company.name} onChange={handleChange} />
        </div>
        <div>
          <label>Catch Phrase:</label>
          <input type="text" name="company.catchPhrase" value={profileData.company.catchPhrase} onChange={handleChange} />
        </div>
        <div>
          <label>BS:</label>
          <input type="text" name="company.bs" value={profileData.company.bs} onChange={handleChange} />
        </div>
        <button type="submit" >Complete Registration</button>
      </form>
    </div>
  );
};

export default CompleteProfile;
