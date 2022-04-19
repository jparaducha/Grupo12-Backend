const router = require("express").Router();
const { Shopping_cart , User, Product, Stock, sequelize} = require("../db");

router.get("/", async (req,res)=>{
    try {
        
    const { id } = req.query;

    const cart = await Shopping_cart.findAll({ where : { "buyer_id" : id }}).then(
            (data)=>{
        let product = {};
        product.name = data.product.name;
        product.image = data.product.images[0];
        product.inventoryQty = data.product.stock;
        product.price = data.unit_price;
        product.itemsToBuy = data.quantity;
        product.product_id = data.product_id;
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
    if(!buyer_id) return res.json("Falta el buyer id");
    if(!seller_id) return res.json("Falta el seller id");
    if(!quantity) return res.json("Falta la cantidad de unidades");

    const stock  = await Stock.findOne({
        where : {
            "id" : seller_id,
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

    const shopping_cart = await Shopping_cart.findOne({
        where : { 
            'buyer_id' : buyer_id ,
            'seller_id' : seller_id ,
            'product_id' : product_id,
            'unit_price' : stock.unit_price    
        }
    })

    if(shopping_cart) {
        shopping_cart.quantity = shopping_cart.quantity + quantity
        shopping_cart.save()
        return res.status(200).send(shopping_cart)
    }

    const buyer = await User.findOne({ where : { "id" : buyer_id },
    include : {
        model : Shopping_cart,
    }
    }).then((data)=>{
    return data;
    }).catch((e)=> console.log(e));


        const cart = await Shopping_cart.create(
            { 
            "product":  product,
            "product_id": product_id,
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