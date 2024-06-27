import React, { createContext, useEffect, useState } from 'react';

// Create the ShopContext
export const ShopContext = createContext(null);

// Create the ShopContextProvider component
const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState({});

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((data) => {
                setAll_Product(data);
                setCartItems(getDefaultCart(data));
            });
            if(localStorage.getItem('auth-token')){
                fetch('http://localhost:4000/getcart',{
                    method:'POST',
                    headers:{
                        Accept:'application/form-data',
                        'auth-token':`${localStorage.getItem('auth-token')}`,
                        'content-Type':'application/json',
                    },
                    body:"",
                }).then((response)=>response.json())
                .then((data)=>setCartItems(data));
            }
    }, []);

    // Function to initialize cart with default values
    function getDefaultCart(products) {
        let cart = {};
        products.forEach(product => {
            cart[product.id] = 0; // Initialize each product's quantity to 0
        });
        return cart;
    }

    // Function to add an item to the cart
    const addToCart = (itemId) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: prev[itemId] + 1 // Increment item quantity in cart
        }));
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": itemId })
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    // Function to remove an item from the cart
    const removeFromCart = (itemId) => {
        if (cartItems[itemId] > 0) {
            setCartItems(prev => ({
                ...prev,
                [itemId]: prev[itemId] - 1 // Decrement item quantity in cart (if > 0)
            }));
            if(localStorage.getItem('auth-token')){
                fetch('http://localhost:4000/removefromcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "itemId": itemId })
                })
                    .then((response) => response.json())
                    .then((data) => console.log(data));
            }
        }
    };

    // Function to get total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    // Function to get total number of items in the cart
    const getTotalCartItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            totalItems += cartItems[item];
        }
        return totalItems;
    }

    // Context value to provide to consumers
    const shopContextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart
    };

    return (
        <ShopContext.Provider value={shopContextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
