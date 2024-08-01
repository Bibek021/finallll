import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [message, setMessage] = useState('Login');
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [error, setError] = useState('');

  const toggleMessage = () => {
    setMessage(prevMessage => prevMessage === 'Sign Up' ? 'Login' : 'Sign Up');
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, password, email } = formData;
    if (message === 'Sign Up' && (!username || !email || !password)) {
      setError('All fields are required.');
      return false;
    }
    if (!email || !password) {
      setError('Email and password are required.');
      return false;
    }
    if (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError('Password must be at least 8 characters long and contain a special character.');
      return false;
    }
    setError('');
    return true;
  };

  const login = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
   
     
     
      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        localStorage.setItem('user-id',responseData.id)
        window.location.replace("/");
      } else {
        setError(responseData.error || 'User doesnot exist, Please sign in...');
      }
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  const signup = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");
      } else {
        setError(responseData.error || 'existing user found with same username');
      }
    } catch (error) {
      setError('An error occurred during signup.');
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{message}</h1>
        <div className="loginsignup-fields">
          {message === "Sign Up" && <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button onClick={() => { message === "Login" ? login() : signup() }}>Continue</button>
        <p className="loginsignup-login">
          {message === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={toggleMessage} style={{ cursor: 'pointer', color: 'blue' }}>
            {message === 'Sign Up' ? ' Login here' : ' Sign up here'}
          </span>
        </p>
        {/* <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div> */}
      </div>
    </div>
  );
};

export default LoginSignup;
