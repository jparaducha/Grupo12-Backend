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

router.get("/:userId", async (req,res)=>{
    const { userId } = req.params;

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
})

module.exports = router;