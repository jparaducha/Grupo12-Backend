const router = require("express").Router();
const { Op } = require("sequelize");
const { Product, Shopping_cart , User, image } = require("../db");

router.get("/", async (req,res)=>{

    try {

        const { product_id, order } = req.query;
        if (product_id) {

            const products = await Product.findOne({
                where: {
                    product_id: product_id,
                },
                include : { 
                    model: User,
                    attributes: ['user_id']
                }
            })
            return res.json(products);
        }


        const products = await Product.findAll();

        if(order === "nameASC"){
            return res.json(products.sort((a,b)=>{
                if(a.name < b.name) return -1;
                if(b.name < a.name) return 1;
                return 0;
            }))
        }

        if(order === "nameDESC"){
            return res.json(products.sort((a,b)=>{
                if(a.name > b.name) return -1;
                if(b.name > a.name) return 1;
                return 0;
            }))
        }

        if(order === "priceASC"){
            return res.json(products.sort((a,b)=>{
                if(a.price < b.price) return -1;
                if(b.price < a.price) return 1;
                return 0;
            }))
        }

        if(order === "priceDESC"){
            return res.json(products.sort((a,b)=>{
                if(a.price > b.price) return -1;
                if(b.price > a.price) return 1;
                return 0;
            }))
        }
        if(order === "oldest"){
            return res.json(products.sort((a,b)=>{
                if(a.added < b.added) return -1;
                if(b.added < a.added) return 1;
                return 0;
            }))
        }

        if(order === "newest"){
            return res.json(products.sort((a,b)=>{
                if(a.added > b.added) return -1;
                if(b.added > a.added) return 1;
                return 0;
            }))
        }
        
        if(order === "ratingASC"){
            return res.json(products.sort((a,b)=>{
                if(a.rating < b.rating) return -1;
                if(b.rating < a.rating) return 1;
                return 0;
            }))
        }

        if(order === "ratingDESC"){
            return res.json(products.sort((a,b)=>{
                if(a.rating > b.rating) return -1;
                if(b.rating > a.rating) return 1;
                return 0;
            }))
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
            added : new Date(Date.now()),
            rating
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
        const user = await User.create({
            name : "Vendedor",
            password : "password",
            email : "email@correo.com"
        })


    }

        json.forEach(async (i)=>{

        const product = await Product.create({
            "name" : i.name,
            "description" : i.description,
            "rating" : i.rating,
            "images" : i.image,
            "category" : i.category,
            "price" : i.price,
            "added" : new Date(Date.now())
        }).then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e.message);
        })

    await user.addProducts(product,{ through : {quantity : 1, unit_price : i.price} })
    .then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e.errors)
    })

    }
    )
    return res.sendStatus(200);


}catch(e){
    console.log(e.message);
}
})

router.get("/categories/", async (req,res)=>{
    try {
        const { type , order } = req.body;

        if(!type){

            const categoryList = await Product.findAll({
                attributes : ['category']
            }).then((data)=>{
                return data;
            }).catch((e)=>{
                console.log(e);
            })
            let result = categoryList.map((i)=> i.category);
            return res.json([...new Set(result)]);
        }
        if(!order)
        {
            const products = await Product.findAll({
                where : {
                    "category" : type
                }
            }).then((data)=>{
                return data;
            }).catch((e)=>{
                console.log(e);
            })

            return res.json(products);
        }

        const products = await Product.findAll({
            where : {
                "category" : type
            }
        }).then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e);
        });

        if(order === "nameASC"){
            return res.json(products.sort((a,b)=>{
                if(a.name < b.name) return -1;
                if(b.name < a.name) return 1;
                return 0;
            }))
        }

        if(order === "nameDESC"){
            return res.json(products.sort((a,b)=>{
                if(a.name > b.name) return -1;
                if(b.name > a.name) return 1;
                return 0;
            }))
        }

        if(order === "priceASC"){
            return res.json(products.sort((a,b)=>{
                if(a.price < b.price) return -1;
                if(b.price < a.price) return 1;
                return 0;
            }))
        }

        if(order === "priceDESC"){
            return res.json(products.sort((a,b)=>{
                if(a.price > b.price) return -1;
                if(b.price > a.price) return 1;
                return 0;
            }))
        }
        if(order === "oldest"){
            return res.json(products.sort((a,b)=>{
                if(a.added < b.added) return -1;
                if(b.added < a.added) return 1;
                return 0;
            }))
        }

        if(order === "newest"){
            return res.json(products.sort((a,b)=>{
                if(a.added > b.added) return -1;
                if(b.added > a.added) return 1;
                return 0;
            }))
        }
        
        if(order === "ratingASC"){
            return res.json(products.sort((a,b)=>{
                if(a.rating < b.rating) return -1;
                if(b.rating < a.rating) return 1;
                return 0;
            }))
        }

        if(order === "ratingDESC"){
            return res.json(products.sort((a,b)=>{
                if(a.rating > b.rating) return -1;
                if(b.rating > a.rating) return 1;
                return 0;
            }))
        }

        res.json(products);
    } catch (error) {
        console.log(error.message);
    }

})

module.exports = router;