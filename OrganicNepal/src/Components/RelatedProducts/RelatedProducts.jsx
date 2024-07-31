import React, { useEffect, useState } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';

const RelatedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/allproducts');
        const data = await response.json();
        // Only take the first 4 products
        setProducts(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {products.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
