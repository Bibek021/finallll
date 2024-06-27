import React, { useEffect, useState } from 'react'
import './MedicinalHerbs.css'

import Item from '../Item/Item';


const MedicinalHerbs = () => {
  const [medicinal_herbs,setNew_collection] = useState([]);

  useEffect(()=>{
     fetch('http://localhost:4000/newcollections')
     .then((response)=>response.json())
     .then((data)=>setNew_collection(data));
  },[])
  return (
    <div className='medicinal-herbs'>
        <h1>MEDICINAL HERBS</h1>
        <hr />
        <div className="collections">
           {medicinal_herbs.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
           })}
            

        </div>


    </div>
  )
}

export default MedicinalHerbs