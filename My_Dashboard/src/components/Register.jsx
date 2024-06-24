import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css'; // Import the CSS file

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
    <div className="register-page">
      <main role="main" className="main">
        <h1>Register</h1>
        <h3>Please fill in the form to create an account.</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your Username"
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your Password"
            required
          />
          <label htmlFor="passwordVerify">Verify Password:</label>
          <input
            type="password"
            id="passwordVerify"
            name="passwordVerify"
            value={formData.passwordVerify}
            onChange={handleChange}
            placeholder="Verify your Password"
            required
          />
          <div className="wrap">
            <button type="submit" id="registerSubmit" name="registerSubmit" className="submit-button">
              Register
            </button>
          </div>
        </form>
        <p>Already have an account? <a href="/login">Sign in</a></p>
      </main>
    </div>
  );
};

export default Register;
