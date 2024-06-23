import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordVerify: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordVerify) {
      alert("Passwords do not match");
      return;
    }

    // Check if username already exists on the server
    fetch('http://localhost:3000/users?username=' + formData.username)
      .then(response => response.json())
      .then(users => {
        if (users.length > 0) {
          alert('Username already exists');
        } else {
          // Proceed to complete profile details
          navigate('/completeProfile', { state: { username: formData.username, password: formData.password } });
        }
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Verify Password:</label>
          <input type="password" name="passwordVerify" value={formData.passwordVerify} onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
