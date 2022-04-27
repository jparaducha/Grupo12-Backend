const router = require("express").Router();
const { Shopping_cart , User, Product, Stock, sequelize} = require("../db");

//--------------------------------------------------------------------------------------------

router.get("/", async (req,res)=>{
    try {
        
    const { id } = req.query;

    if(!id) return res.json("Must provide a valid id");

    const cart = await Shopping_cart.findAll({ where : { "buyer_id" : id }});
    
    if (!cart || !cart.length) return res.sendStatus(204);

    res.status(400).send(cart);

    } catch (error) {
        console.log(error.message);
    };
});

//--------------------------------------------------------------------------------------------

router.post("/", async (req,res)=> {

    const { buyer_id , products } = req.body;

    if(!products) return res.json("Error : Missing products in request");
    if(!buyer_id) return res.json("Error : Missing buyer_id in request");
    if(!(typeof products !== Array)) return res.json("Error : products is not an array");
    
    const productsToAdd = [];

    const result = [];
    const productsNotAdded=[];

    const buyer = await User.findOne({ where : { "user_id" : buyer_id }});

    for (let productToAdd of products){
        
        var product = await Product.findOne({
            where : {
                'product_id' : productToAdd.product_id
            }
        });

        if (!product) return res.status(404).send('Product not found')

        //------------------------------
        
        const stock = await Stock.findOne({
            where : {
                "user_id" : productToAdd.seller_id,
                "product_id" : productToAdd.product_id,
                },
        });

        if (!stock) return res.status(404).send('Stock not found')

        //------------------------------

        // stock.quantity = stock.quantity - productToAdd.quantity;
        // stock.save();
        // product.stock = product.stock - productToAdd.quantity;
        // product.save();
        
        //------------------------------

        const overwrite = await Shopping_cart.findOne({
            where : {
                'buyer_id' : buyer_id,
                'product_id' : productToAdd.product_id,
                'seller_id' : productToAdd.seller_id
            }
        });

        if (overwrite) {
            overwrite.quantity = productToAdd.quantity;
            overwrite.product = product;
            overwrite.save();

            //------------------------------

            stock.quantity = stock.quantity + productToAdd.quantity;
            stock.save();
            product.stock = product.stock + productToAdd.quantity;
            product.save();

            //------------------------------

            result.push(overwrite);
        } else{
            if (product){
                const cart = Shopping_cart.create(
                    { 
                    "product":  product,
                    "product_id": productToAdd.product_id,
                    "unit_price" : stock.unit_price,
                    "buyer_id": buyer_id,
                    "quantity" : productToAdd.quantity,
                    "seller_id" : productToAdd.seller_id
                    });
                    productsToAdd.push(cart);
                }else{
                    productsNotAdded.push(productToAdd.product_id);
                }
            }
        };

    Promise.all(productsToAdd).then((productsAdded) => {
        productsAdded.forEach((product)=>{
            buyer.addShopping_cart(product);
            result.push(product);
        })
    }).then(()=>{
        const toSend = {
            'added' : result,
            'not added' : productsNotAdded
        };
        return res.status(200).send(toSend);
    }).catch((e)=>{
        console.log(e);
        return res.status(400).send(e.message);
    });
});

//--------------------------------------------------------------------------------------------

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
            const product = Product.findOne({
                where : {
                    'product_id' : product_id
                }
            });
            product.stock = product.stock - quantity;
            product.save();
            
            const stock = Stock.findOne({
                where : {
                    'product_id' : product_id,
                    'seller_id' : seller_id
                }
            });
            stock.quantity = stock.quantity - quantity;
            stock.save();
            return res.status(200).send('Deleted succesfully');
        };
    }).catch ((e) => {
        console.log(e);
        return res.status(400).send(e.message)
    });
});

//--------------------------------------------------------------------------------------------

router.patch('/' , async (req,res) => {

    const {buyer_id , seller_id , product_id , newQuantity} = req.body;

    Shopping_cart.findOne({
        where : {
            "buyer_id" : buyer_id,
            "seller_id" : seller_id,
            "product_id" : product_id
        }
    }).then((productInCart) => {
        const stock = Stock.findOne({
            where : {
                'product_id' : product_id,
                'seller_id' : seller_id
            }
        });
        if (newQuantity>stock.quantity) return res.send('Actualmente hay menos stock a ese precio del solicitado');
        productInCart.quantity = newQuantity;
        productInCart.save();
        return productInCart;
    }).then((productInCart) => {
        return res.status(200).send(productInCart);
    }).catch((e) => {
        console.log(e);
        return res.status(400).send(e.message);
    });
});

//--------------------------------------------------------------------------------------------


module.exports = router;