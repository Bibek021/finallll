import p1_img from './adhuwa.JPG';
import p2_img from './akabare.jpg';
import p4_img from './alaichi.jpg'
import p6_img from './bajekopeda.jpg';

export const data_product = [
    
    {
        id: 1,  // Changed to a unique id
        name: "Ginger from ILLAM",
        image: p1_img ,
        new_price: 350.0,
        old_price: 400.25,
    },
    {
        id: 2,
        name: "Round chillies from hill",
        image: p2_img,
        new_price: 380.0,
        old_price: 400.25,
    },
    {
        id: 4,
        name: "Cardamom from the hills",
        image: p4_img,
        new_price: 1500.0,
        old_price: 1700.25,
    },
    {
        id: 6,
        name: "Peda of Barmajya",
        image: p6_img,
        new_price: 1050.0,
        old_price: 1100.0,
    },
];
export default data_product;
