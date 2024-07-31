import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "himalayan",
    new_price: "",
    old_price: "",
    quantity: "",
    description: ""
  });

  const imageHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setProductDetails({ ...productDetails, image: file });
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    console.log(productDetails);
    let responseData;
    let product = { ...productDetails };

    let formData = new FormData();
    formData.append('product', image);

    try {
      const uploadResponse = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });
      responseData = await uploadResponse.json();

      if (responseData.success) {
        product.image = responseData.image_url;
        console.log(product);

        const addProductResponse = await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        const addProductData = await addProductResponse.json();
        if (addProductData.success) {
          alert("Product Added Successfully!");
          // Clear form after successful addition
          setProductDetails({
            name: "",
            image: "",
            category: "himalayan",
            new_price: "",
            old_price: "",
            quantity: "",
            description: ""
          });
          setImage(null);
        } else {
          alert("Failed to add product");
        }
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product");
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className='add-product'>
        <h1>Add Product</h1>
        <div className="addproduct-itemfield">
          <p>Product Title</p>
          <input
            value={productDetails.name}
            onChange={changeHandler}
            type="text"
            name='name'
            placeholder='Enter product title'
            autoComplete="off"
          />
        </div>
        <div className="addproduct-price">
          <div className="addproduct-itemfield">
            <p>Price</p>
            <input
              value={productDetails.old_price}
              onChange={changeHandler}
              type="text"
              name='old_price'
              placeholder='Enter price'
              autoComplete="off"
            />
          </div>
          <div className="addproduct-itemfield">
            <p>Offer Price</p>
            <input
              value={productDetails.new_price}
              onChange={changeHandler}
              type="text"
              name='new_price'
              placeholder='Enter offer price'
              autoComplete="off"
            />
          </div>
        </div>
        <div className="addproduct-itemfield">
          <p>Product Category</p>
          <select
            value={productDetails.category}
            onChange={changeHandler}
            name="category"
            className='add-product-selector'
            autoComplete="off"
          >
            <option value="himalayan">Himalayan</option>
            <option value="hilly">Hilly</option>
            <option value="terai">Terai</option>
          </select>
        </div>
        <div className="addproduct-itemfield">
          <p>Quantity</p>
          <input
            value={productDetails.quantity}
            onChange={changeHandler}
            type="number"
            name='quantity'
            placeholder='Enter quantity'
            autoComplete="off"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Description</p>
          <textarea
            value={productDetails.description}
            onChange={changeHandler}
            name='description'
            placeholder='Enter product description here'
            rows="4"
          />
        </div>
        <div className="addproduct-itemfield">
          <label htmlFor="file-input">
            <img
              src={image ? URL.createObjectURL(image) : upload_area}
              className='addproduct-thumbnail-img'
              alt="Upload"
            />
          </label>
          <input
            onChange={imageHandler}
            type="file"
            name='image'
            id='file-input'
            hidden
          />
        </div>
        <button onClick={addProduct} className='addproduct-btn'>ADD</button>
      </div>
    </>
  );
};

export default AddProduct;
