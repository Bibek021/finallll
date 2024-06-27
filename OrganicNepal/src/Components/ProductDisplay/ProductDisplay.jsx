import React, { useContext } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = ({ product }) => {
  const {addToCart} = useContext(ShopContext);
  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={product.image} alt="Main product" />
        </div>
        <div className="productdisplay-img-list">
          <img src={product.image} alt="Product thumbnail" />
          <img src={product.image} alt="Product thumbnail" />
          <img src={product.image} alt="Product thumbnail" />
          <img src={product.image} alt="Product thumbnail" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_dull_icon} alt="dull star" />
          <p>(110)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">Old Price: perkg/{product.old_price}</div>
          <div className="productdisplay-right-price-new">New Price: perkg/{product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          100% Organic product. It is very good for health. Increase your living time.
        </div>
        <div className="productdisplay-right-quantity">
          <h1>Minimum order starts from 1kg</h1>
        </div>
        <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
      </div>
    </div>
  );
};

export default ProductDisplay;
