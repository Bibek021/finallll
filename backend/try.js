const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const port = 4000;
const app = express();

app.use(express.json());
app.use(cors());

// Database connection with mongoDB
mongoose.connect("mongodb+srv://bibekpandit:Hello@cluster0.cgwtwtw.mongodb.net/e-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image Storage Engine
const Storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: Storage });

// Creating Upload Endpoint for images
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Schema for Creating Products
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
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  quantity:{
    type:Number,
    required:true
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

app.post('/addproduct', async (req, res) => {
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
  });

  await product.save();
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API For deleting Products
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({
    success: true,
  });
});

// Creating API For getting all products
app.get('/allproducts', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

// Schema Creating for User model
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

// Creating Endpoint for registering user
app.post('/signup', async (req, res) => {
  const check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const cart = Array.from({ length: 300 }, () => 0);

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    cartData: cart,
  });

  await user.save();

  const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
  res.json({ success: true, token });
});

// Creating endpoint for user login
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

// Creating endpoint for new collection data
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newCollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  res.send(newCollection);
})

// Creating endpoint for popular with us
app.get('/popularwithus', async (req, res) => {
  let products = await Product.find({ category: "terai" });
  let popular_with_us = products.slice(0, 4);
  console.log("Popular with us Fetched");
  res.send(popular_with_us);
})

// Creating middleware to fetch user
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

// Creating endpoint for adding products to cart data
app.post('/addtocart', fetchUser, async (req, res) => {
  console.log("Added", req.body.itemId);
  let userData = await User.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
})

// Creating endpoint to remove product from cart data
app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log("Removed", req.body.itemId);
  let userData = await User.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
})

// Creating endpoint to get cart data
app.post('/getcart', fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await User.findOne({ _id: req.user.id });
  res.json(userData.cartData);
})

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on port " + port);
  } else {
    console.log("Error: " + error);
  }
});
