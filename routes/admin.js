const router = require("express").Router();
const { User, Product, Stock } = require("../db");

router.post("/delete", async (req,res)=>{
    try {
        const { userId, productId } = req.body;

        const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

        // const uuidv4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

        if(userId && !userId.match(uuidRegex)) return res.json("User ID must be an UUID");

        if(!Boolean(userId) && !Boolean(productId)) return res.json("Invalid inputs");

//--------BUSCA EL USUARIO---------------//
        let usuario;
        if(userId)
        {
        usuario = await User.findOne({
            where : {
                "user_id" : userId
            }
        }).then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e);
        });
        }


//--------BUSCA EL PRODUCTO---------------//
        let producto
        if(productId)
        {
        producto = await Product.findOne({
            where : {
                "product_id" : productId
            }
        }).then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e);
        });
        }
 //-----------SI SE PASAN IDS PERO NO SE ENCUENTRAN FILAS CON LAS MISMAS---------------//
        if(productId && !producto) return res.json("Product not found");

        if(userId && !usuario) return res.json("User not found");


//------------SI SE ENCUENTRAN FILAS SE DESASOCIAN EL USUARIO Y EL PRODUCTO-----------//
        if(usuario && producto)
        {

            const decrease = await Stock.findOne({
                where : {
                    "user_id" : userId,
                    "product_id" : productId
                },
                attributes : ["quantity"]
            }).then((data)=>{
                return data;
            }).catch((e)=>{
                console.log(e);
            });

            await usuario.removeProducts(producto);
            producto.stock -= decrease.quantity;

            await producto.save();

            return res.json("User unassociated from product");
        }

//--------------SI SOLO SE ENCUENTRA EL USUARIO SE LO BORRA-------------//
        if(usuario)
        {
            await usuario.destroy();

            return res.json("User deleted");
        }

//-------------SI SOLO SE ENCUENTRA EL PRODUCTO SE LO BORRA--------------//
        if(producto){
            await producto.destroy();

            return res.json("Product deleted");
        }
    } catch (error) {
        console.log(error.message);
    }
});

router.post("/ban", async (req,res)=>{
    try {
        const { userId } = req.body;

        const uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

        if(!Boolean(userId)) return res.json("Invalid input");
        if(!userId.match(uuidRegex)) return res.json("User ID must be an UUID");

        
        const user = await User.findOne({
            where : {
                "user_id" : userId
            }
        }).then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e);
        });

        user.active = false;

        await user.save();

        return res.json("Account deactivated");
    } catch (error) {
        console.log(error);
    }
});

router.post("/approve/:productId" , async (req,res)=>{
    try {
        const { productId } = req.params;

        const product = await Product.findOne({
            where : {
                "product_id" : productId
            }
        });

        if(!product) return res.json("Product not found");

        product.approved = true;

        await product.save();

        return res.json("Product approved");
    } catch (error) {
        console.log(error);
    }
});

router.post("/disapprove/:productId" , async (req,res)=>{
    try {
        const { productId } = req.params;

        const product = await Product.findOne({
            where : {
                "product_id" : productId
            }
        });

        if(!product) return res.json("Product not found");

        product.approved = false;

        await product.save();

        return res.json("Product disapproved");
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;