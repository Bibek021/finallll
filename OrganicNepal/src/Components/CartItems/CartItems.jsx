import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext);

  // Check if cartItems is defined and is an object
  if (!cartItems || typeof cartItems !== 'object') {
    console.error('cartItems is not defined or not an object');
    return <p>Error: cartItems is not defined correctly.</p>;
  }

  const subtotal = getTotalCartAmount();

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
          <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder='promo code' />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
