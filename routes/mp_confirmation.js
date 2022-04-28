const { Shopping_cart, Movement } = require("../db");

const router = require("express").Router();


router.post("/", async (req,res)=>{
    try {
        const { body , query } = req;

        const { collection_id , collection_status , preference_id , status, payment_type } = query;

        const { external_reference, ...nuevoObj } = query

        const cart = await Shopping_cart.findAll({
            where : {
                buyer_id : external_reference
            }
        });
        let elements = [];

        cart.forEach( async function(i){ 
            elements.push(i.product.name);

            await Movement.create({
                seller : i.seller_id,
                buyer_id : external_reference,
                product : i.product.name,
                type : "SALE",
                notes : status,
                productImg : i.product.images[0]
            });
        });

        



        return res.json([{...nuevoObj, buyer_id : external_reference}, elements]);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;