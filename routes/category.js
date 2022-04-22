const router = require('express').Router();
const {Product, Category} = require('../db');

router.post('/', async (req,res)=>{

    const {parent_name, name } = req.body;
    let parent;
    let category = await Category.findOne({
        where: {
            name : name,
        }
    })
    if (category){
        return res.status(400).json("Category already exists")
    }
    
    if ( parent_name ){
        parent = await Category.findOne({
            where : {
                'name' : parent_name
            }
        })
        if (!parent){
            return res.status(400).json("Parent category not found")
        }
    }
    const newCategory = await Category.create({
        name,
    }).then((data)=>{
        return data;
    }).catch((e)=>{
        console.log(e);
        return res.status(400).send(e.message)
    });
    if (parent){
        await parent.addChildren(newCategory).then((data)=>{
            console.log(data);
        }).catch((e)=>{
            console.log(e);
            return res.status(400).send(e.message)
        })
    };
    res.send(newCategory);
})

router.get('/', async (req,res)=> {

    const {name} = req.query;

    if (name){
        Category.findOne({
            where : {'name' : name}
        }).then((category) => {
            return res.status(200).send(category);
        }).catch((error) => {
            console.log(error);
            return res.status(400).send(error.message)
        })
    }

    const categories = Category.findAll()
    .then((categories) => {
        return res.status(200).send(categories);
    })
    .catch((error)=>{
        console.log(error);
        return res.status(400).send(error.message)
    })
    

})

module.exports = router;