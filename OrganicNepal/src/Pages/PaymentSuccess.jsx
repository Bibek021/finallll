import React, { useEffect } from 'react';

const PaymentSuccess = () => {
  useEffect(() => {
    // Retrieve the necessary data from localStorage
    const amount = localStorage.getItem('amount');
    const transactionUuid = localStorage.getItem('transaction-uuid');
    const userId = localStorage.getItem('user-id');



    // Define the payload
    const payload = {
      amount: amount,
      transactionUuid: transactionUuid,
      userId: userId,
    };

    // Define the headers
    const headers = {
      'Content-Type': 'application/json',
      'auth-token': `${localStorage.getItem('auth-token')}`,
    };

    // Make the API request
    fetch('http://localhost:4000/payment-success', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Payment success:', data);
        // Handle the response data as needed

        window.location.replace("/");
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle the error as needed
      });
  }, []);

  return <></>;
};

export default PaymentSuccess;
