
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory'
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import PaymentSuccess from './Pages/PaymentSuccess';
import PaymentFailure from './Pages/PaymentFailure';
import mountain_banner from './Components/Assets/mountainbanner.jpg'
import hill_banner from './Components/Assets/hillsbanner.jpg'
import terai_banner from './Components/Assets/teraibanner.webp'


function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/mountains' element={<ShopCategory banner={mountain_banner} category="himalayan" />}/>
        <Route path='/hills' element={<ShopCategory banner={hill_banner} category="hilly" />}/>
        <Route path='/terais' element={<ShopCategory banner={terai_banner} category="terai" />}/>
        <Route path="/product" element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/payment-success' element={<PaymentSuccess/>}/>
        <Route path='/payment-failure' element={<PaymentFailure/>}/>

       </Routes>
       <Footer/>
     


      </BrowserRouter>
    </div>
  );
}

export default App;
