import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      // Simulate storing an authentication token
      localStorage.setItem('authToken', 'fake-jwt-token');
      onLogin(); // Notify parent component about successful login
      window.location.href='/listproduct';
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='login-container'>
      <h2>Admin Login</h2>
      <div className='form-group'>
        <label htmlFor='username'>Username:</label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete='off'
        />
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className='error-message'>{error}</p>}
      <button className='login-btn' onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default AdminLogin;
