import React, { useEffect, useState } from 'react';
import './Users.css'; // Ensure this path is correct

import Navbar from '../Components/Navbar/Navbar.jsx';
import Sidebar from '../Components/Sidebar/Sidebar.jsx';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/allusers');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data); // Initialize filtered users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery === '') {
      setFilteredUsers(users);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const results = users.filter(user =>
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user._id.toLowerCase().includes(lowercasedQuery) // Added ID search
      );
      setFilteredUsers(results);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className='users-list-container'>
        <div className='header-search-container'>
          <h1>Users List</h1>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by Name, Email, or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
        </div>
        <div className="users-list-box">
          <div className="users-format-main">
            <p>Id</p>
            <p>Username</p>
            <p>Email</p>
            <p>Date</p>
            <p>Cart Items</p>
          </div>
          <div className="users-all-items">
            <hr />
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user._id}>
                  <div className="users-format-main users-item-format">
                    <p>{user._id}</p>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <p>{new Date(user.date).toLocaleDateString()}</p>
                    <p>{user.cartData.length}</p>
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
