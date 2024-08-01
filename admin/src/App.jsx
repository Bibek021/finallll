import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './Pages/AdminLogin.jsx';
import AddProduct from './Components/AddProduct/AddProduct.jsx';
import ListProduct from './Components/ListProduct/ListProduct.jsx';
import Inventory from './Pages/Inventory.jsx';
import Payment from './Pages/Payment.jsx';
import Users from './Pages/Users.jsx';
import NotFound from './Components/NotFound/NotFound.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('authToken') !== null
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/adminlogin" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="/" element={<AdminLogin onLogin={handleLogin} />} />
        <Route
          path="/addproduct"
          element={isAuthenticated ? <AddProduct /> : <Navigate to="/adminlogin" />}
        />
        <Route
          path="/listproduct"
          element={isAuthenticated ? <ListProduct onLogout={handleLogout} /> : <Navigate to="/adminlogin" />}
        />
        <Route
          path="/inventory"
          element={isAuthenticated ? <Inventory /> : <Navigate to="/adminlogin" />}
        />
        <Route
          path="/payment"
          element={isAuthenticated ? <Payment /> : <Navigate to="/adminlogin" />}
        />
        <Route
          path="/users"
          element={isAuthenticated ? <Users /> : <Navigate to="/adminlogin" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
