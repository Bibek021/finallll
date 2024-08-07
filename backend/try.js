const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const port = 4000;
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect("mongodb+srv://bibekpandit:Hello@cluster0.cgwtwtw.mongodb.net/e-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image Storage Engine setup for multer
const Storage = multer.diskStorage({
  destination: './upload/images', // Directory where images will be stored
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); // Filename format
  }
});

const upload = multer({ storage: Storage });

// Serving uploaded images statically
app.use('/images', express.static('upload/images'));

// Endpoint for image upload
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}` // URL of the uploaded image
  });
});

// Schema for creating products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  }
});

// Endpoint to add a new product
app.post('/addproduct', async (req, res) => {
  // Extract product details from the request body
  const { name, image, category, new_price, old_price, quantity, description } = req.body;

  // Validate that the required fields are present
  if (!name || !category || !new_price || !old_price || !quantity) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.',
    });
  }

  // Validate that new_price, old_price, and quantity are numbers
  const newPrice = parseFloat(new_price);
  const oldPrice = parseFloat(old_price);
  const qty = parseInt(quantity, 10);

  if (isNaN(newPrice) || newPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Offer price must be a positive number.',
    });
  }

  if (isNaN(oldPrice) || oldPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a positive number.',
    });
  }

  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a positive number.',
    });
  }

  // Get the latest product id and increment by 1
  try {
    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    // Create a new product with the validated data
    const product = new Product({
      id,
      name,
      image,
      category,
      new_price: newPrice,
      old_price: oldPrice,
      quantity: qty,
      description,
    });

    // Save the product to the database
    await product.save();
    res.json({
      success: true,
      name,
    });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while saving the product.',
    });
  }
});

// Endpoint for deleting a product
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({
    success: true,
  });
});

// Endpoint to get all products
app.get('/allproducts', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

// Schema for creating users
const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartData: {
    type: [Number], // Use an array for cart data
    default: () => Array(300).fill(0), // Initialize with 300 items, all set to 0
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

// Endpoint for user registration
app.post('/signup', async (req, res) => {
  const check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
  res.json({ success: true, token });
});

// Endpoint for user login
app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const passCompare = await bcrypt.compare(req.body.password, user.password);
    if (passCompare) {
      const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
      res.json({ success: true, token: token, id: user.id });
    } else {
      res.status(401).json({ success: false, error: "Wrong Password" });
    }
  } else {
    res.status(404).json({ success: false, errors: "Wrong Email ID" });
  }
});

// Endpoint to get new collection data
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newCollection = products.slice(1).slice(-8); // Get the last 8 products
  res.send(newCollection);
})

// Endpoint to get popular products
app.get('/popularwithus', async (req, res) => {
  let products = await Product.find({ category: "terai" });
  let popular_with_us = products.slice(0, 4); // Get the first 4 products
  res.send(popular_with_us);
})

// Middleware to fetch user from JWT token
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, 'secret_ecom');
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
}

// Endpoint to add product to cart
app.post('/addtocart', fetchUser, async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    let product = await Product.findOne({ id: req.body.itemId });

    if (product && product.quantity > 0) {
      userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;

      // Decrease the quantity in the product database
      product.quantity -= 1;
      await product.save();

      await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
      res.json({ message: "Added" });
    } else {
      res.status(400).json({ error: "Product out of stock" });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to remove product from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    let product = await Product.findOne({ id: req.body.itemId });

    if (!userData || !product) {
      return res.status(404).send("User or Product not found");
    }

    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
      product.quantity += 1;

      await product.save();
      await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
      res.status(200).send("Removed");
    } else {
      res.status(400).send("Item not found in cart");
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to get cart data
app.post('/getcart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  if (userData) {
    res.send(userData.cartData);
  } else {
    res.status(404).send("User not found");
  }
});

// Schema for storing payments
const Payment = mongoose.model('Payment', {
  transactionUuid: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  }
});

// Endpoint for adding payment
app.post("/payment-success", async (req, res) => {
  const { amount, transactionUuid, userId } = req.body;

  try {
    // Create a new Payment instance
    const newPayment = new Payment({
      transactionUuid: transactionUuid,
      amount: amount, // Ensure the amount is a number
      userId: userId,
    });

    // Save the new Payment instance to the database
    await newPayment.save();

    console.log('Payment saved:', newPayment);

    // Find the user by userId and clear their cartData
    const user = await User.findById(userId);
    if (user) {
      user.cartData = []; // Clear the cart data
      await user.save();
      console.log('User cart data cleared:', user);
    } else {
      console.warn('User not found with ID:', userId);
    }

    // Send a success response
    res.json({ success: true, payment: newPayment });
  } catch (error) {
    console.error('Error saving payment or clearing user cart data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Server listener
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
