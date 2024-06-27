import React from 'react'
import './DescriptionBox.css'


const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (110)</div>
        </div>
        <div className="descriptionbox-description">
            <p>An e-commerce website is an online platform that facilates in busying and selling
                of products or services over the internet. It serves as a virtual marketplace where
                business and individual showcase their products and interact with costumers. </p>
                <p>
                    We typically display organic products with images,prices and available variables.
                    Each product usually has its own value..
                </p>
        </div>

    </div>
  )
}

export default DescriptionBox