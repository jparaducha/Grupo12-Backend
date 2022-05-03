const router = require("express").Router();
const { sequelize , User , Product} = require("../db");
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
            return data
        })
        .catch((err)=> console.log(err));

        if(!users || !users.length) return res.json("No users found")
        if(users) return res.json(users);
    } catch (error) {
        console.log(error.message);
        res.send("error");
    }
})

router.patch("/rating", async (req,res)=>{
    try {
        const { userId } = req.query;
        const { rating } = req.body;

        if(!rating) return res.json("Missing rating");

    const user = await User.findOne({
        where : {
            user_id:  userId
        }
    }).then((data)=> data).catch(console.log);


    user.rating_as_seller = rating;

    await user.save();


    return res.json(user);

    } catch (error) {
        console.log(error.message)
    }
})

router.patch("/provider", async (req,res)=>{
    try {
        const { userId } = req.query;

        if(!userId) return res.json("Must provide an user id").status(400);

        const user = await User.findOne({
            where : {
                user_id : userId
            }
        })
        .then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e);
        });


        if(!user) return res.json("User not found");
        if(user.provider === "true") return res.json("User is already a provider");

        user.provider = "requested";

        await user.save();

        return res.sendStatus(200);
    } catch (error) {
        console.log(error.message);
        return res.sendStatus(500);
    }
})

module.exports = router;