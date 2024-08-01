import React, { useEffect, useState } from 'react';
import './Payment.css'; // Ensure this path is correct

import Navbar from '../Components/Navbar/Navbar.jsx';
import Sidebar from '../Components/Sidebar/Sidebar.jsx';

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:4000/allpayments');
      const data = await response.json();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery === '') {
      setFilteredPayments(payments);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const results = payments.filter(payment =>
        payment.transactionUuid.toLowerCase().includes(lowercasedQuery) ||
        payment.userId.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredPayments(results);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className='payment-list-container'>
        <div className='header-search-container'>
          <h1>Payment List</h1>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by Transaction ID or User ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
        </div>
        <div className="payment-list-box">
          <div className="payment-format-main">
            <p>Transaction ID</p>
            <p>Amount</p>
            <p>User ID</p>
          </div>
          <div className="payment-all-items">
            <hr />
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <div key={payment.transactionUuid}>
                  <div className="payment-format-main payment-item-format">
                    <p>{payment.transactionUuid}</p>
                    <p>Rs {payment.amount}</p>
                    <p>{payment.userId}</p>
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <p>No payments found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
