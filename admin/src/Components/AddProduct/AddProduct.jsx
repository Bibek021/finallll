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

  const [errors, setErrors] = useState({
    name: "",
    new_price: "",
    old_price: "",
    quantity: "",
    image: "",
  });

  const imageHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setProductDetails({ ...productDetails, image: file });
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { ...errors };

    // Check for empty fields
    if (!productDetails.name) {
      newErrors.name = "Product title is required.";
      valid = false;
    } else {
      newErrors.name = "";
    }

    // Validate price and quantity
    const newPrice = parseFloat(productDetails.new_price);
    const oldPrice = parseFloat(productDetails.old_price);
    const quantity = parseInt(productDetails.quantity, 10);

    if (isNaN(newPrice) || newPrice <= 0) {
      newErrors.new_price = "Offer price must be a positive number.";
      valid = false;
    } else {
      newErrors.new_price = "";
    }
    if (newPrice > oldPrice) {
      newErrors.new_price = "Offer price cannot be greater than the original price.";
      valid = false;
    } else {
      newErrors.new_price = "";
    }

    if (isNaN(oldPrice) || oldPrice <= 0) {
      newErrors.old_price = "Price must be a positive number.";
      valid = false;
    } else {
      newErrors.old_price = "";
    }

    if (isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = "Quantity must be a positive number.";
      valid = false;
    } else {
      newErrors.quantity = "";
    }

    // Check for image upload
    if (!image) {
      newErrors.image = "Image is required.";
      valid = false;
    } else {
      newErrors.image = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const addProduct = async () => {
    if (!validateForm()) {
      return; // Exit if form validation fails
    }

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
          setErrors({
            name: "",
            new_price: "",
            old_price: "",
            quantity: "",
            image: "",
          });
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
          {errors.name && <p className="error-message">{errors.name}</p>}
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
            {errors.old_price && <p className="error-message">{errors.old_price}</p>}
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
            {errors.new_price && <p className="error-message">{errors.new_price}</p>}
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
          {errors.quantity && <p className="error-message">{errors.quantity}</p>}
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
          {errors.image && <p className="error-message">{errors.image}</p>}
        </div>
        <button onClick={addProduct} className='addproduct-btn'>ADD</button>
      </div>
    </>
  );
};

export default AddProduct;
