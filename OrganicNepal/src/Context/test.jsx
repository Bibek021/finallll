import React, { createContext, useEffect, useState } from 'react';

// Create the ShopContext
export const ShopContext = createContext(null);

// Create the ShopContextProvider component
const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:4000/allproducts');
            const data = await response.json();
            setAll_Product(data);
            setCartItems(getDefaultCart(data));

            if (localStorage.getItem('auth-token')) {
                const cartResponse = await fetch('http://localhost:4000/getcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: null,
                });
                const cartData = await cartResponse.json();
                setCartItems(cartData);
            }
        };
        fetchProducts();
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
    const addToCart = async (itemId) => {
        // Check if the product quantity is greater than 0
        const product = all_product.find(product => product.id === itemId);
        if (product && product.quantity > 0) {
            // Update cart state
            setCartItems(prev => ({
                ...prev,
                [itemId]: prev[itemId] + 1
            }));
    
            if (localStorage.getItem('auth-token')) {
                try {
                    const response = await fetch('http://localhost:4000/addtocart', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'auth-token': `${localStorage.getItem('auth-token')}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ "itemId": itemId })
                    });
    
                    // Handle response as text
                    const responseText = await response.text();
                        if (response.ok) {
                        // Optionally update the quantity locally
                        setAll_Product(prev => prev.map(p =>
                            p.id === itemId ? { ...p, quantity: p.quantity - 1 } : p
                        ));
                        console.log(responseText); // Optional
                    } else {
                        // Handle server-side errors
                        const errorData = JSON.parse(responseText);
                        alert(errorData.error || 'An error occurred. Please try again.');
                    }
                } catch (error) {
                    console.error("Error adding to cart:", error);
                    alert('An error occurred. Please try again.');
                }
            }
        } else {
            alert('Product out of stock.');
        }
    };
    
    

    // Function to remove an item from the cart
    const removeFromCart = async (itemId) => {
        if (cartItems[itemId] > 0) {
            setCartItems(prev => ({
                ...prev,
                [itemId]: prev[itemId] - 1 // Decrement item quantity in cart (if > 0)
            }));
    
            if (localStorage.getItem('auth-token')) {
                try {
                    const response = await fetch('http://localhost:4000/removefromcart', {
                        method: 'POST',
                        headers: {
                            Accept: 'text/plain', // Expect plain text response
                            'auth-token': `${localStorage.getItem('auth-token')}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ "itemId": itemId })
                    });
    
                    // Read response as text
                    const responseText = await response.text();
                    
                    if (!response.ok) {
                        throw new Error(responseText || 'An error occurred.');
                    }
    
                    // Handle successful response
                    console.log(responseText); // Optional
    
                } catch (error) {
                    console.error("Error removing from cart:", error);
                    alert(error.message || 'An error occurred. Please try again.');
                }
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
