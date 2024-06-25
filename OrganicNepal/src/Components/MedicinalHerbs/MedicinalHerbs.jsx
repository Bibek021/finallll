import React from 'react'
import './MedicinalHerbs.css'
import medicinal_herbs from  '../Assets/medicinal_herbs/medicinal_herbs'
import Item from '../Item/Item';


const MedicinalHerbs = () => {
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