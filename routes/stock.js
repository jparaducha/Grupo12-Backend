const router = require("express").Router();
const { Product , User } = require('../db.js')

router.post('/', async (req,res) => {
    try{

        const { user_id , product_id , quantity , unit_price} = req.body;
        const user = await User.findOne({ where: { "user_id" : user_id } }).then((data)=>{
            return data;
        }).catch((e)=> console.log(e));

        if(!user) return res.json("Usuario no encontrado");

        const product = await Product.findOne({ where: { "product_id" : product_id } }).then((data)=>{
            return data;
        }).catch((e)=> console.log(e));

        const currentStock = product.stock;
        product.stock = currentStock + quantity;
        await product.save();


        if(!user) return res.json("Usuario no encontrado");

        const stock = await user.addProduct(product, { through: { quantity : quantity , unit_price : unit_price}})
            .then((response) => {
                res.json(response)
            })

    } catch (error){
        console.log(error.message)
    }
})

module.exports= router;