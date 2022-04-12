const router = require("express").Router();
const { sequelize , User } = require("../db");
const authorization = require("../middleware/authorization");


router.post("/", authorization,async (req,res)=>{
    try {
        //req.user trae la información desde authorization 


        const user = await User.findOne({ where : { "user_id" : req.user}});

        res.json(user.dataValues); // devuelve la información del usuario desde traída por query desde la db;
    } catch (error) {
        console.log(error);
        res.status(500).json("Server error");
    }
});

router.get("/", async(req,res)=>{
    try {
        const users = await User.findAll().then((data)=>{
            return data.map(i => i.dataValues)
        })
        .catch((err)=> console.log(err));

        if(users) res.json(users);

        res.send("error");
    } catch (error) {
        console.log(error.message);
    }
})

module.exports = router;