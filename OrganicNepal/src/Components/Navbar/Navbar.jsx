import React, { useContext, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getTotalCartItems } = useContext(ShopContext);

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} height={100} width={100} alt="" />
                <p>OrganicNepal</p>
            </div>
            <ul className="nav-menu">
                <li onClick={() => { setMenu("shop") }}>
                    <Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>
                    {menu === "shop" ? <hr /> : <></>}
                </li>
                <li onClick={() => { setMenu("mountains") }}>
                    <Link style={{ textDecoration: 'none' }} to='/mountains'>Mountain</Link>
                    {menu === "mountains" ? <hr /> : <></>}
                </li>
                <li onClick={() => { setMenu("hills") }}>
                    <Link style={{ textDecoration: 'none' }} to='/hills'>Hill</Link>
                    {menu === "hills" ? <hr /> : <></>}
                </li>
                <li onClick={() => { setMenu("terais") }}>
                    <Link style={{ textDecoration: 'none' }} to='/terais'>Terai</Link>
                    {menu === "terais" ? <hr /> : <></>}
                </li>
            </ul>
            <div className="nav-login-cart">
            {localStorage.getItem('auth-token')
          ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
        :<Link to='/login'><button>Login</button></Link> }
                <Link to='/cart'><img src={cart_icon} height={60} width={60} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    );
}

export default Navbar;
