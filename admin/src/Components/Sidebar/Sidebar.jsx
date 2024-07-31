import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import add_product_icon from '../../assets/Product_Cart.svg';
import list_product_icon from '../../assets/Product_list_icon.svg';
import inventory_icon from '../../assets/inventoryt.png'; // Ensure this icon exists in your assets
import payment_icon from '../../assets/payment.png'; // Add this line
import users_icon from '../../assets/userss.png'; // Add this line

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to={'/addproduct'} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="Add Product" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={'/listproduct'} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="Product List" />
          <p>Product List</p>
        </div>
      </Link>
      <Link to={'/inventory'} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={inventory_icon} alt="Inventory" className='inventory-icon'/>
          <p>Inventory</p>
        </div>
      </Link>
      <Link to={'/users'} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={users_icon} alt="Users" className='inventory-icon'/>
          <p>Users</p>
        </div>
      </Link>
      <Link to={'/payment'} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={payment_icon} alt="Payment" className='inventory-icon'/>
          <p>Payment</p>
        </div>
      </Link>
      
    </div>
  );
}

export default Sidebar;
