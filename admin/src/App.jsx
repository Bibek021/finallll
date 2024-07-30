import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogIn from "./Pages/AdminLogin.jsx";
import AddProduct from "./Components/AddProduct/AddProduct.jsx";
import ListProduct from "./Components/ListProduct/ListProduct.jsx";
import Inventory from "./Pages/Inventory.jsx";

const App = () => {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<AdminLogIn />} />
        <Route path="/adminlogin" element={<AdminLogIn />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
