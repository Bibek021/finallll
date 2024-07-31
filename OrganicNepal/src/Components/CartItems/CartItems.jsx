import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
import CryptoJS from 'crypto-js';

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext);

  // Check if cartItems is defined and is an object
  if (!cartItems || typeof cartItems !== 'object') {
    console.error('cartItems is not defined or not an object');
    return <p>Error: cartItems is not defined correctly.</p>;
  }

  const subtotal = getTotalCartAmount();

  const handleCheckout = async (amount) => {
    try {


      const totalAmount = amount;

      // Generate a unique transaction UUID
  var currentTime = new Date();
  var formattedTime = currentTime.toISOString().slice(2, 10).replace(/-/g, '') + '-' + currentTime.getHours() + currentTime.getMinutes() + currentTime.getSeconds();
  const transactionUuid = `${amount}-${formattedTime}`;

  localStorage.setItem("amount",amount);
  localStorage.setItem("transaction-uuid",transactionUuid);



    // Set up the payment parameters
    const params = {
      amount: amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: 'EPAYTEST',
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: 'http://localhost:3000/payment-success',
      failure_url: 'http://localhost:3000/payment-failure',
      signed_field_names: 'total_amount,transaction_uuid,product_code',
    };

      // Generate the signature
  const secret = '8gBm/:&EnhH.1/q'; // Replace with your eSewa secret key
  const hash = CryptoJS.HmacSHA256(`total_amount=${params.total_amount},transaction_uuid=${params.transaction_uuid},product_code=${params.product_code}`, secret);
  const signature = CryptoJS.enc.Base64.stringify(hash);

  params.signature = signature;

  // Create a form and submit it to eSewa
  const form = document.createElement('form');
  form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
  form.method = 'POST';
  
  Object.keys(params).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = params[key];
    form.appendChild(input);
  });
  
  document.body.appendChild(form);
  form.submit();
  

      
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };


  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price per kg</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((product) => {
        const { id, name, image, new_price } = product;
        const quantity = cartItems[id] || 0; // Default to 0 if id not found in cartItems

        if (quantity > 0) {
          return (
            <div key={id}>
              <div className="cartitems-format">
                <img src={image} alt={name} className="carticon-product-icon" />
                <p>{name}</p>
                <p>Rs {new_price}</p>
                <button className="cartitems-quantity">{quantity}</button>
                <p>Rs {new_price * quantity}</p>
                <img
                  src={remove_icon}
                  onClick={() => {
                    removeFromCart(id);
                  }}
                  alt="Remove"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>Rs {subtotal}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Transport Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>Rs {subtotal}</h3>
            </div>
          </div>
          <button  onClick={() => handleCheckout(subtotal)}>PROCEED TO CHECKOUT</button>
        </div>
       
      </div>
    </div>
  );
};

export default CartItems;
