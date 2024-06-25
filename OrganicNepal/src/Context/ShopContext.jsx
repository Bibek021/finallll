import React, { createContext } from 'react';
import all_product from '../Components/Assets/all_product';

// Create the ShopContext
export const ShopContext = createContext(null);

// Create the ShopContextProvider component
const ShopContextProvider = (props) => {
    const shopContextValue = { all_product };

    return (
        <ShopContext.Provider value={shopContextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
