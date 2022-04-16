const fs = require('fs');
const axios = require('axios');

const get_data_API = async () =>{
    const url = await axios.get(`https://fakestoreapi.com/products`); 
    const info_api= await url.data.map(e=>{
        return {
            id:Number(e.id),
            name: e.title,
            description: e.description,
            price:e.price,
            category:e.category,
            image: [e.image],
            rating:e.rating.rate
        }
    })
    // console.log(info_api)
    // return info_api;
    fs.writeFile('products.json', JSON.stringify(info_api),'utf8',
    (err)=>{
        if(err) throw err;
        console.log('The file has been saved successfully')
    });
};

const info=get_data_API();



