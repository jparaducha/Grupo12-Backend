const router = require("express").Router();
const { Shoppingcart , User, Product, sequelize} = require("../db");

router.get("/", async (req,res)=>{
    try {
        
    const { userId } = req.body;

    const cart = await User.findOne({ where : { "user_id" : userId },
    include : {
        model : Shoppingcart,
        attributes: ["product"]
    },
    // attributes : ["name"]
}).then((data)=>{
    return data;
}).catch((e)=> console.log(e));

    // const cart2 = await Shoppingcart.findOne({ where: { "userUserId": userId } })
    // .then((data)=>{
    //     return data;
    // }).catch((e)=>{
    //     console.log(e);
    // })


    // console.log("DEBERIA DEVOLVER???",cart.dataValues);

    res.json(cart.shoppingcarts.map((i)=> i.product));
    } catch (error) {
        console.log(error.message);
    }
})


router.post("/", async (req,res)=> {

    try {
        
    const { userId , productId } = req.body;

    if(!productId) return res.json("Falta el product id");

    const product  = await Product.findOne({ where : { "product_id" : productId } }).then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e);
    })

    const userC = await User.findOne({ where : { "user_id" : userId },
    include : {
        model : Shoppingcart,
        // attributes: ["products"]
    }
    }).then((data)=>{
    return data;
    }).catch((e)=> console.log(e));


    // if(!userC) console.log("No existe el usuario");

    // console.log("user", userC.dataValues.shoppingcart.products);

    // if(!userC.dataValues.shoppingcart.products.length) {
    //     console.log("no tiene productos en el carrito!!");

    //     let nuevoCart = await Shoppingcart.create({
    //         products : [product.dataValues]
    //     }).then((data)=>{
    //         // console.log("Carritoo!!.products", data.dataValues.products);
    //         return data;
    //     }).catch((e)=>{
    //         console.log(e);
    //     })
    //     userC.addShoppingcarts(nuevoCart);

    //     // console.log("69",userC.dataValues.shoppingcart.products);
    //     return res.json("Carrito creado");
    // }else{
        // console.log("YA TIENE PRODUCTOS !!!!")

        const cart = await Shoppingcart.create(
            { "product":  product.dataValues})
        .then((data)=>{
            // console.log("data", data.dataValues.products);
            return data;
        })
        .catch((e)=>{
            console.log(e);
        });
        
        userC.addShoppingcart(cart);
        // console.log("cart.dataValues.products", cart.dataValues.products);
        // await cart.products.push(product.dataValues);
        console.log("product pusheado: ", product.dataValues);

        // await cart.save().then((data)=>{
        //     return data;
        // }).catch((e)=>{
        //     console.log(e);
        // })
        // console.log("AGREGADO OTRO !!!");

        // console.log("car 88", newcart.dataValues);
    // }


    // const cart = await Shopping_cart.create({
    //     product=
    // })

    res.json(200);
    } catch (error) {
        console.log(error.message);
    }
})




module.exports = router;