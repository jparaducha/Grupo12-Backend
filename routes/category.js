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
    });
    if (parent){
        await parent.addChildren(newCategory).then((data)=>{
            console.log(data);
        }).catch((e)=>{
            console.log(e);
        })
    };
    res.send(newCategory);
})

router.get('/', async (req,res)=> {

    const categories = await Category.findAll();
    return res.status(200).send(categories);

})

module.exports = router;