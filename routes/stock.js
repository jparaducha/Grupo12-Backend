const router = require("express").Router();
const { Product , User , Stock } = require('../db.js')

router.post('/', async (req,res) => {
    try{

        const { user_id , product_id , quantity , unit_price} = req.body;

        if(![user_id, product_id, quantity, unit_price].every(Boolean)) return res.json("Faltan datos");
        
        const user = await User.findOne({ where: { "user_id" : user_id } }).then((data)=>{
            return data;
        }).catch((e)=> console.log(e));

        if(!user) return res.json("Usuario no encontrado");
        if(!user.active) return res.json("Usuario inactivo");

        //--------------------------------------------------------------------

        const product = await Product.findOne({ where: { "product_id" : product_id } }).then((data)=>{
            return data;
        }).catch((e)=> console.log(e));

        if(!product) return res.json("Producto no encontrado");

        //--------------------------------------------------------------------

        const stockEntry = await Stock.findOne({ where: { 'product_id' : product_id , 'user_id':user_id}}) 
            
        //--------------------------------------------------------------------
        
        const currentStock = product.stock;
        product.stock = currentStock + quantity;
        await product.save();

        //--------------------------------------------------------------------
        
        if (!stockEntry){
            await user.addProduct(product, { through: { quantity : quantity , unit_price : unit_price}})
            .then((response) => {
                res.json(response)
            })
            .catch((error) =>{
                console.log(error.message)
            })
        } else {
            stockEntry.quantity= stockEntry.quantity + quantity;
            stockEntry.save();
            res.json('Stock Agregado')
        }
        //--------------------------------------------------------------------
    } catch (error){
        console.log(error.message)
    }
})

module.exports= router;