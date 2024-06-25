import React from 'react';
import './Item.css';

const Item = ({ id, name, image, new_price, old_price }) => {
    return (
        <div className="item">
            <div className="item-image-container">
                <img src={image} alt={name} className="item-image" />
            </div>
            <h2 className="item-name">{name}</h2>
            <p className="item-new-price">New Price: per Kg{new_price.toFixed(2)}</p>
            <p className="item-old-price">Old Price: per kg{old_price.toFixed(2)}</p>
        </div>
    );
};

export default Item;
