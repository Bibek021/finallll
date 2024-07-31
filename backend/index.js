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
  // Get the latest product id and increment by 1
  const products = await Product.find({});
  const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const product = new Product({
    id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
    quantity: req.body.quantity,
    description: req.body.description,
  });

  await product.save();
  res.json({
    success: true,
    name: req.body.name,
  });
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
    type: Object,
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

  // Initialize cart with default values
  const cart = Array.from({ length: 300 }, () => 0);

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    cartData: cart,
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
      res.json({ success: true, token });
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
  console.log("NewCollection Fetched");
  res.send(newCollection);
})

// Endpoint to get popular products
app.get('/popularwithus', async (req, res) => {
  let products = await Product.find({ category: "terai" });
  let popular_with_us = products.slice(0, 4); // Get the first 4 products
  console.log("Popular with us Fetched");
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
// Endpoint to add product to cart
app.post('/addtocart', fetchUser, async (req, res) => {
  console.log("Added", req.body.itemId);
  try {
    let userData = await User.findOne({ _id: req.user.id });
    let product = await Product.findOne({ id: req.body.itemId });

    if (product && product.quantity > 0) {
      userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;

      // Decrease the quantity in the product database
      product.quantity -= 1;
      await product.save();

      await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
      res.json({ message: "Added" }); // Sending JSON response
    } else {
      res.status(400).json({ error: "Product out of stock" }); // Sending JSON response with error
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Sending JSON response with error
  }
});




// Endpoint to remove product from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log("Request body:", req.body);

  try {
      let userData = await User.findOne({ _id: req.user.id });
      console.log("User data:", userData);

      let product = await Product.findOne({ id: req.body.itemId });
      console.log("Product before update:", product);

      if (!userData || !product) {
          return res.status(404).send("User or Product not found");
      }

      if (userData.cartData[req.body.itemId] > 0) {
          userData.cartData[req.body.itemId] -= 1;
          product.quantity += 1;

          console.log("Current quantity before update:", product.quantity);
          await product.save();
          console.log("New quantity after update:", product.quantity);

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
  console.log("GetCart");
  let userData = await User.findOne({ _id: req.user.id });
  res.json(userData.cartData);
})

// Start the server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on port " + port);
  } else {
    console.log("Error: " + error);
  }
});
