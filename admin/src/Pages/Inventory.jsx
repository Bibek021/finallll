import React, { useEffect, useState } from 'react';
import './Inventory.css'; // Ensure this path is correct

import Navbar from '../Components/Navbar/Navbar.jsx';
import Sidebar from '../Components/Sidebar/Sidebar.jsx';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      const data = await response.json();
      setInventoryItems(data);
      setFilteredItems(data); // Initialize filtered items
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery === '') {
      setFilteredItems(inventoryItems);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const results = inventoryItems.filter(item =>
        item.name.toLowerCase().includes(lowercasedQuery) ||
        item.category.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredItems(results);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className='inventory-list-container'>
        <div className='header-search-container'>
          <h1>Inventory List</h1>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by Product Name or Category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
        </div>
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
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id}>
                  <div className="inventory-format-main inventory-item-format">
                    <img src={item.image} alt="" className="inventory-product-icon" />
                    <p>{item.name}</p>
                    <p>${item.new_price}</p>
                    <p>{item.category}</p>
                    <p>{item.quantity}</p>
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <p>No items found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
