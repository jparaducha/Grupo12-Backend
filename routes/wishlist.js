const { User, Wishlist } = require('../db');
const Product = require('../models/Product');

const router = require('express').Router();


router.post('/', (req,res) => {
    try{
        const {user_id , product_id} = req.body;

        const user = await User.findOne({
            where : {
                'user_id' : user_id,
            }
        })

        Product.findOne({
            where : {
                'product_id' : product_id,
            }
        }).then((product)=>{
            return user.addWishlisted(product);
        }).then((result) => {
            res.status(200)
        })


    }
    catch( error) {
        console.log(e);
        return res.status(400).send(e.message);
    }
})