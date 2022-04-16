const router = require("express").Router();
const { Op } = require("sequelize");
const { Product, Shopping_cart , User, image } = require("../db");

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
        const {  name, description, category_id, image } = req.body;

        const rating = Math.random * 5;

        if(![name, description,].every(Boolean)) return res.json("Faltan datos");

        const response = await Product.create({
            name,
            description,
            category_id,
            image,
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
        const { id, name , description, approved } = req.body;

        let product = await Product.findOne({ where: { "product_id" : id } });

        if(!product) return res.json("Producto no encontrado");

        if(name) product.name = name;
        if(description) product.description = description;
        if(image) product.image =  image;
        if(price) product.price = price;
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

        product.approved = false;
        await product.save();

        res.send(product);
    } catch (error) {
        console.log(error.message);
    }
})

module.exports = router;