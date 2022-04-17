const router = require("express").Router();
const { Shopping_cart , User, Product, Stock, sequelize} = require("../db");

router.get("/", async (req,res)=>{
    try {
        
    const { userId } = req.body;

const cart = await Shopping_cart.findAll({
     where : {
          "userUserId" : userId
        },
    attributes : ["quantity", "unit_price", "product"]
    }
    ).then((data)=>{
    return data;
}).catch((e)=> console.log(e));


    res.json(cart);
    } catch (error) {
        console.log(error.message);
    }
})


router.post("/", async (req,res)=> {

    try {
        
    const { userId , productId } = req.body;

    if(!productId) return res.json("Falta el product id");

    const product  = await Product.findOne({
         where : {
              "product_id" : productId
             },
        include : {
            model : User,
            attributes : ["name", "user_id"]
        }
        }).then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e);
    })


    const price = await Stock.findOne({
        where : {
            "productProductId" : productId,
            // "userUserId" :
        },
        attributes : ["unit_price"]
    })


    const userC = await User.findOne({ where : { "user_id" : userId },
    include : {
        model : Shopping_cart,
    }
    }).then((data)=>{
    return data;
    }).catch((e)=> console.log(e));


    const cartU = await Shopping_cart.findOne({
        where : {
            "userUserId" : userId
        }
    }).then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e);
    })


    if(cartU && cartU.product.product_id === productId){

        cartU.quantity++;

        await cartU.save();
        return res.json("Updated quantity");
    }


        const cart = await Shopping_cart.create(
            { "product":  product.dataValues,
            "unit_price" : price.dataValues.unit_price,
        quantity : 1})
        .then((data)=>{
            return data;
        })
        .catch((e)=>{
            console.log(e);
        });
        
        userC.addShopping_cart(cart);

    res.json(200);
    } catch (error) {
        console.log(error.message);
    }
})




module.exports = router;