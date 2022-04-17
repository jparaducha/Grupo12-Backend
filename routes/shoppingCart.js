const router = require("express").Router();
const { Shopping_cart , User, Product, Stock, sequelize} = require("../db");

router.get("/", async (req,res)=>{
    try {
        
    const { user_id } = req.body;

    const cart = await Shopping_cart.findAll({ where : { "buyer_id" : user_id }}).then((data)=>{
        return data;
    }).catch((e)=> console.log(e));


    res.json(cart);
    } catch (error) {
        console.log(error.message);
    }
})


router.post("/", async (req,res)=> {

    try {
        
    const { buyer_id , product_id , seller_id , quantity } = req.body;

    if(!product_id) return res.json("Falta el product id");

    const stock  = await Stock.findOne({
        where : {
            "user_id" : seller_id,
            "product_id" : product_id,
            },
        }).then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e);
    })

    const product = await Product.findOne({
        where : {
            "product_id" : product_id
        }
        }).then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e);
    })

    const buyer = await User.findOne({ where : { "user_id" : buyer_id },
    include : {
        model : Shopping_cart,
    }
    }).then((data)=>{
    return data;
    }).catch((e)=> console.log(e));


    const buyerCart = await Shopping_cart.findOne({
        where : {
            "buyer_id" : buyer_id
        }
    }).then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e);
    })


    if(buyerCart && buyerCart.product_id === product_id){

        buyerCart.quantity++;

        await buyerCart.save();
        return res.json("Updated quantity");
    }

        const cart = await Shopping_cart.create(
            { "product":  product,
            "unit_price" : stock.dataValues.unit_price,
            "buyer_id": buyer_id,
            "quantity" : quantity,
            "seller_id" : seller_id
            })
        .then((data)=>{
            return data;
        })
        .catch((e)=>{
            console.log(e);
        });
        
        buyer.addShopping_cart(cart);

    res.json(200);
    } catch (error) {
        console.log(error.message);
    }
})




module.exports = router;