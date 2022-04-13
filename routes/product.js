const router = require("express").Router();
const { Op } = require("sequelize");
const { Product, Shopping_cart , User } = require("../db");

router.get("/", async (req,res)=>{
    try {
        
    const products = await Product.findAll({ 
        include : {
        model:  User,
        attributes : ["name", "email", "address", "rating_as_buyer", "rating_as_seller"],
        // through: {attributes: []}
    }
    });

    res.json(products);
    } catch (error) {
        console.log(error.message);
    }
})

router.get("/search", async (req,res)=>{
    try {
        const { search } = req.body

        const products = await Product.findAll({ where: { "product_name" : {[Op.iLike]: `%${search}%`} }})

        res.json(products);
    } catch (error) {
        console.log(error.message);
    }
})

router.post("/", async (req,res)=>{

    try {
        const { userId ,  name, description, stock, rating } = req.body;
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

        
        if(!regexExp.test(userId)) return res.json("Id de usuario no válida");

        if(![name, description, userId].every(Boolean)) return res.json("Faltan datos");

        const user = await User.findOne({ where: { "user_id" : userId } }).then((data)=>{
            return data;
        }).catch((e)=> console.log(e));

        if(!user) return res.json("Usuario no encontrado");

        const response = await Product.create({
            "product_name" : name,
            description,
            stock,
            rating
        }).then((response) => {
            return response;
        })
        .catch((e)=> console.log(e));

        user.addProduct(response);

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