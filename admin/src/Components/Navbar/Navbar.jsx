import React from 'react';
import './Navbar.css';
import navlogo from '../../assets/logo.png';
import navprofile from '../../assets/besar.png';

const Navbar = () => {
  const handleLogout = () => {
    // Clear user authentication data from local storage
    localStorage.removeItem('authToken');
    // You can perform additional logout-related tasks here if needed
    // Example: redirect to the login page
    window.location.href = '/login';
  };

  return (
    <div className='navbar'>
      <img src={navlogo} alt="" className="nav-logo" />
      <img src={navprofile} className='nav-profile' alt="" />
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Navbar;
