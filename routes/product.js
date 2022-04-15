const router = require("express").Router();
const { Op } = require("sequelize");
const { Product, Shopping_cart , User, stock } = require("../db");

router.get("/", async (req,res)=>{

    const {product_id} = req.body;
    let products
    try {

        if (product_id) {

            products = await Product.findOne({
                where: {
                    product_id: product_id
                },
                include : { 
                    model: User,
                    attributes: ['user_id']
                }
            })

        } else {

            products = await Product.findAll();

        }
        return res.json(products);
    } catch (error) {
        console.log(error.message);
    }
})

router.get("/search", async (req,res)=>{
    try {
        const { search } = req.body

        const products = await Product.findAll({ where: { "name" : {[Op.iLike]: `%${search}%`} }})

        res.json(products);
    } catch (error) {
        console.log(error.message);
    }
})

router.post("/", async (req,res)=>{
    try {
        const {  name, description } = req.body;

        if(![name, description,].every(Boolean)) return res.json("Faltan datos");

        const response = await Product.create({
            name,
            description,
        }).then((response) => {
            return response;
        })
        .catch((e)=> console.log(e));
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
})

router.patch("/", async (req,res)=>{
    try {
        const { id, name , description, stock, rating , amount_sold , approved } = req.body;

        let product = await Product.findOne({ where: { "product_id" : id } });

        if(!product) return res.json("Producto no encontrado");

        if(name) product.product_name = name;
        if(description) product.description = description;
        if(stock) product.stock =  stock;
        if(rating) product.rating = rating;
        if(amount_sold) product.amount_sold = Number(product.amount_sold) +Number(amount_sold);
        if(approved) product.approved = approved;

        await product.save();

        res.json(product);
    } catch (error) {
        console.log(error.message);
    }
})

router.delete("/", async (req,res)=>{
    try {
        const { id } = req.body;


        let product = await Product.findOne({ where: { "product_id" : id } }).then((data)=>{
            return data;
        }).catch((e)=> console.log(e));

        if(!product) return res.json("Producto no encontrado");

        let aux = product.dataValues;
        product.destroy();

        res.json(aux);
    } catch (error) {
        console.log(error.message);
    }
})

module.exports = router;