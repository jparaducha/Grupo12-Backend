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

router.post("/load", async(req,res)=>{
try{
    const json = require("../utils/products.json");

    const user = await User.findOne().then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e.message);
    });

    if(!user){
        await User.create({
            name : "Vendedor",
            password : "password",
            email : "email@correo.com"
        })
    }


    // const response = await Promise.all(
        json.forEach(async (i)=>{

        const product = await Product.create({
            "name" : i.name,
            "description" : i.description,
            "rating" : i.rating
        }).then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e.message);
        })

        // console.log("producto creado : ", product.dataValues.name);
        
        

    // console.log("usuario:", user.dataValues.name);

    await user.addProducts(product,{ through : {quantity : 1, unit_price : i.price} })
    .then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e.errors)
    })

    }
    )
    // ).then((data)=>{
    //     return data;
    // }).catch((e)=>{
    //     console.log(e);
    // })

    // console.log(json);

    // const loaded = await Product.bulkCreate(json);

    // const user = await User.findOne();

    // user.addProducts(loaded);

    // console.log(response);
    return res.sendStatus(200);


}catch(e){
    console.log(e.message);
}
})

module.exports = router;