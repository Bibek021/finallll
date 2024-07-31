import React, { useEffect, useState } from 'react';
import './Inventory.css'; // Assuming you have defined Inventory.css

import Navbar from '../Components/Navbar/Navbar.jsx';
import Sidebar from '../Components/Sidebar/Sidebar.jsx';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts'); // Ensure this endpoint is correct
      const data = await response.json();
      setInventoryItems(data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className='inventory-list-container'>
        <h1>Inventory List</h1>
        <div className="product-list-box">
          <div className="inventory-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Category</p>
            <p>Quantity</p>
          </div>
          <div className="inventory-all-items">
            <hr />
            {inventoryItems.map((item) => (
              <div key={item.id}>
                <div className="inventory-format-main inventory-item-format">
                  <img src={item.image} alt="" className="inventory-product-icon" />
                  <p>{item.name}</p>
                  <p>${item.new_price}</p>
                  <p>{item.category}</p>
                  <p>{item.quantity}</p>
                  {/* <p>{item.quantity}</p> */}
                </div>
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
