// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Todos from './components/Todos';
import Posts from './components/Posts';
import Albums from './components/Albums';
import Info from './components/Info';
import CompleteProfile from './components/CompleteProfile';
import NavBar from './components/NavBar'; // Import NavBar
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar /> {/* Include NavBar */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/completeProfile" element={<CompleteProfile />} />
          <Route path="/users/:userId/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/users/:userId/todos" element={<PrivateRoute><Todos /></PrivateRoute>} />
          <Route path="/users/:userId/posts" element={<PrivateRoute><Posts /></PrivateRoute>} />
          <Route path="/users/:userId/albums" element={<PrivateRoute><Albums /></PrivateRoute>} />
          <Route path="/users/:userId/info" element={<PrivateRoute><Info /></PrivateRoute>} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
