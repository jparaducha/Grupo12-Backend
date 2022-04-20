const router = require("express").Router();
const { Shopping_cart , User, Product, Stock, sequelize} = require("../db");

router.get("/", async (req,res)=>{
    try {
        
    const { id } = req.query;

    const cart = await Shopping_cart.findAll({ where : { "buyer_id" : id }});
    
    if (!cart) return res.send('Este usuario no existe o no tiene productos en el carrito')

    res.status(400).send(cart);

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
            "user_id" : seller_id,
            "product_id" : product_id,
            },
    });

    if(!stock) return res.send('Actualmente no hay stock de ese producto')

    const product = await Product.findOne({
        where : {
            "product_id" : product_id
        }
    })

    if (!product) return res.status(400).send('El producto no se encuentra listado')

    const shopping_cart = await Shopping_cart.findOne({
        where : { 
            'buyer_id' : buyer_id ,
            'seller_id' : seller_id ,
            'product_id' : product_id,
            'unit_price' : stock.unit_price,
            //'approved' : true    
        }
    })

    if(shopping_cart) {
        shopping_cart.quantity = shopping_cart.quantity + quantity
        shopping_cart.save()
        return res.status(200).send(shopping_cart)
    }

    const buyer = await User.findOne({ where : { "user_id" : buyer_id }});

    if (!buyer) return res.status(400).send('El usuario comprador no existe')
    
    const cart = await Shopping_cart.create(
        { 
        "product":  product,
        "product_id": product_id,
        "unit_price" : stock.unit_price,
        "buyer_id": buyer_id,
        "quantity" : quantity,
        "seller_id" : seller_id
        });
    
    await buyer.addShopping_cart(cart);

    res.status(200).send(cart);
    } catch (error) {
        console.log(error.message);
    }
})

router.delete('/' , async (req,res) =>{
    
    const {buyer_id , seller_id , product_id} = req.body;

    if ( !buyer_id || !seller_id || !product_id) return res.status(400).send('Faltan datos');

    Shopping_cart.destroy({
        where : {
            "buyer_id" : buyer_id,
            "seller_id" : seller_id,
            "product_id" : product_id
        }
    }).then((rowsDeleted) => {
        if (rowsDeleted === 1 ){
            console.log('Deleted succesfully')
            return res.status(200).send('Deleted succesfully');
        };
    }).catch ((e) => {
        console.log(e);
        return res.status(400).send(e.message)
    })
})

router.patch('/' , async (req,res) => {

    const {buyer_id , seller_id , product_id , newQuantity} = req.body;

    Shopping_cart.findOne({
        where : {
            "buyer_id" : buyer_id,
            "seller_id" : seller_id,
            "product_id" : product_id
        }
    }).then((productInCart) => {
        productInCart.quantity = newQuantity;
        productInCart.save()
        return productInCart;
    }).then((productInCart) => {
        return res.status(200).send(productInCart);
    }).catch((e) => {
        console.log(e);
        return res.status(400).send(e.message)
    })

})


module.exports = router;