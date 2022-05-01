const router = require("express").Router();

const { crearOrden } = require("../utils/MPcontroller");

const { User, Product, Movement, Stock, Shopping_cart} = require("../db");

router.post("/prueba", crearOrden);


router.post("/sold", async(req,res)=>{
    try {
        
        const { seller_id, buyer_id , product_id, input, output, type, notes, quantity } = req.body;

        const seller = await User.findByPk(seller_id);

        const buyer = await User.findByPk(buyer_id);

        const product = await Product.findByPk(product_id);

        if(!product.approved) return res.json("Product not approved to sell");
        if(!seller) return res.json("Seller not found");
        if(!buyer) return res.json("Buyer not found");
        if(!product) return res.json("Product not found");

        if(product.stock< quantity) return res.json("Not enough stock");

        const stockP = await Stock.findOne({
            where : {
                user_id : seller_id,
                product_id : product_id
            },
            // attributes : ["quantity", "unit_price"]
        }).then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e);
        });

        if(stockP.quantity < quantity) return res.json("Not enough stock from seller");

        product.stock-= quantity;
        stockP.quantity-= quantity;
        await stockP.save();
        await product.save();

        // product.addSellers()
        // .then((data)=>{
        //     return data;
        // })
        // .catch((e)=>{
        //     console.log(e);
        // })

        const newMove = await Movement.create({
            seller,
            product,
            buyer_id
        }).then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e);
        });

        // await newMove.addUser(seller);
        // await seller.setProduct(product);

        return res.send(newMove).status(200);
    } catch (error) {
        console.log(error);
    }
});

router.get("/", async (req,res)=>{
    try {
        
    const { userId , type } = req.query;

    //----- SI SE PASA USER ID SIN TYPE O TYPE = BUYER DEVUELVE LOS MOVIMIENTOS DE UN COMPRADOR -----
    if(userId &&( !type || type === "buyer")) {

    const moves = await Movement.findAll({
        where : {
            buyer_id : userId
        }
    }).then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e);
    });
    
    return res.json(moves);
    }

    //------ SI SE PASA USER ID CON TYPE = SELLER DEVUELVE LOS MOVIMIENTOS DE UN VENDEDOR ------
    if(userId && type === "seller"){

    const moves = await Movement.findAll({
        where : {
            seller : userId
        }
    }).then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e);
    });
    
    return res.json(moves);
    }

    //----- SI NO SE PASA USER ID DEVUELVE TODOS LOS MOVIMIENTOS -----------------
    const moves = await Movement.findAll().then((data)=> data)
    .catch((e)=>{
        console.log(e.error);
        return res.sendStatus(500);
    })

    return res.json(moves);
    //---------------------------------------------------------------------------

    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500);
    }
})

router.post("/review", async (req,res)=>{
    try {
        const { orderId } = req.query;
        const { review } = req.body;

        if(!orderId) return res.json("An order id must be provided");
        if(!review) return res.json("Missing review");

        let move = await Movement.findOne(
            {
            where : {
                order_id : orderId
            }
        }
        );

        if(!move) return res.json("Movement not found");

        move.notes = review;
        move.rated = true;

        await move.save();

        return res.json("Review saved");
    } catch (error) { 
        console.log(error.message);
        return res.sendStatus(500);
    }
});


router.patch("/notification", async (req,res)=>{
    try {
        const { userId } = req.query;

        if(!userId) return res.json("Missing user id");

        const moves = await Movement.findAll({
            where : {
                buyer_id : userId
            }
        })
        .then((data)=>{
            return data;
        })
        .catch(console.log);


        if(!moves || !moves.length) return res.json("User has no moves");

        moves.forEach(async (ele) => {
            ele.seen= true;

            await ele.save();
        });

        return res.json("Movements seen");

    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500);
    }
})

module.exports = router;