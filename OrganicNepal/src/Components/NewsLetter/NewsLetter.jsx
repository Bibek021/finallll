import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Get Exclusive Offers On your Email</h1>
        <p>Suscribe to stay updated</p>
        <div>
            <input type="email" placeholder='Your Email id' />
            <button>Suscribe</button>
        </div>

    </div>
  )
}

export default NewsLetter