const router = require("express").Router();
const { sequelize , User, Reset, Signup } = require("../db");
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Crypto = require("crypto");


const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");


const { 
    NODEMAILERUSER,
    NODEMAILERPASS
} = process.env;

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth : {
        user : NODEMAILERUSER,
        pass : NODEMAILERPASS
    }
});



router.post("/register", validInfo ,async (req,res)=>{
    try {
        //1. destructure req.body;

        const {  name, email, password } = req.body;
        
        const user = await User.findOne({ where : { "email" : email}}); // busca en la db usuarios con el mismo email;
        
        if(user){ // si el email está en uso devuelve un error;
            return res.status(401).send("Email already in use");
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds); // genera una sal para el hasheo de bcrypt;
        const hashedPassword = await bcrypt.hash(password, salt); // bcrypt hashea la contraseña;

        //.4 enter new user in db;

        const newUser = await User.create({
            "name"  : name,
            "password" : hashedPassword,
            "email" : email
        })
        ////////*****//////////

    let token = Crypto.randomBytes(8).toString('hex');
        
      let emailText = `Entre al siguiente enlace para verificar su correo electrónico http://localhost:5000/auth/verify?token=${token}`;
      const options = {
          from : `HUBAZAR<${NODEMAILERUSER}>`,
          to : email,
          subject : "Verificar correo",
          text : emailText
      }
      transporter.sendMail(options, (err, info)=>{
          if(err) {
              console.log(err.message);
              return
          }
          res.json(info.response);
      });

      const newcode = await Signup.create({
          "token" : token,
          "email" : email
      })
      .then((data)=>{
          return data;
      }).catch((e)=>{
          console.log(e);
      })
      
      res.json("Correo enviado");

      ////////*****//////////

        //.5 generate jwt;

        // const token = jwtGenerator(newUser.dataValues.user_id); // se genera un JWT ligado al user_id;
        // res.json(token);

    } catch (error) {
        console.log(error);
    }
})

router.get("/verify", async (req,res)=>{
    try {
        const { token } = req.query; 

        const email = await Signup.findOne({
             where : {
                  token : token
                },
            attributes : ["email"]

            }).then((data)=>{
                return data;
            }).catch((e)=>{
                console.log(e);
            });

        if(!email) return res.json("Token no encontrado");

            // console.log("email a verificaR ???" ,email.dataValues.email);

        const verifiedUser = await User.findOne({
            where : {
                email : email.email
            }
        }).then((data)=>{
            return data;
        }).catch((e)=>{
            console.log(e);
        });

        if(!verifiedUser) return res.json("Usuario no encontrado"),

        verifiedUser.active = true;

        await verifiedUser.save();
        // await email.destroy();

        const tokenU = jwtGenerator(verifiedUser.dataValues.user_id); // se genera un JWT ligado al user_id;
        res.json(tokenU);

        // return res.json("Usuario verificado");

    } catch (error) {
        console.log(error.message);
    }
})

router.post("/login", validInfo, async (req,res)=>{
    try {

        //.1 destructure de req.body;
        const { email, password} = req.body;

        //.2 check if user doesn't exist;
        const user = await User.findOne({ where : { "email" : email } });

        if(!user){
            res.status(401).send("Email is incorrect");
        }
        //.3 check if incoming password is the same as in the db;

        let passwordIsValid = await bcrypt.compare(password, user.dataValues.password); //bcrypt.compare() compara la contraseña que le pasa el usuario y la que se encuentra en la db "password";

        if(!passwordIsValid){
            res.status(401).send("Password is incorrect"); // si la contraseña no es la misma se devuelve un error;
        }

        //.4 give them the jwt;

        const token = jwtGenerator(user.dataValues.user_id, user.dataValues.email); // se genera un token JWT ligado al user_id y se devuelve al usuario;
        res.json(token);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.get("/is-verify",authorization, async (req,res)=> {
    try {
        res.json(true); // después de pasar por el middlware authorization se devuelve 'true';
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
})


router.post("/forgot", async (req,res)=>{
    try {
      const { email } = req.body;
  
      let query = await User.findOne({ where : { "email" : email } })
      .then((res)=>{
          if(!res.dataValues){
              res.json("Email no registrado");
          }

          return res.dataValues;
      }).catch((err)=>{
          console.log(err)
        });

  
      let token = Crypto.randomBytes(3).toString('hex');
  

      let newQuery = await Reset.create({
          token , email, expiry : new Date(Date.now() + 15000*60)
      });
  
      let emailText = `Este es el código para cambiar su contraseña ${token}`;
      const options = {
          from : `HUBAZAR<${NODEMAILERUSER}>`,
          to : email,
          subject : "Cambio de contraseña",
          text : emailText
      }
      transporter.sendMail(options, (err, info)=>{
          if(err) {
              console.log(err.message);
              return
          }
          res.json(info.response);
      })
      
      res.json("Correo enviado");
  
    } catch (error) {
        console.log(error.message);
    }
  
  
  });

  router.post("/changePassword", async (req,res)=>{
    try {
        
    const { password, token } = req.body;
    let expired = false;

    let today = new Date(Date.now());

    let query = await Reset.findOne({ where : { "token": token } });

    if(!query || !query.dataValues){
        expired = true;
        res.json("token expirado");
    }

    if(today > query.dataValues.expiry){
        let fila = await Reset.findOne({ where : { "token" : token}});
        fila.destroy();

        expired = true;
    }

    if(expired) res.json("Token expirado").status(304)
    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds); // genera una sal para el hasheo de bcrypt;
    let hashedPassword = await bcrypt.hash(password, salt); // bcrypt hashea la contraseña;


    let response = await User.findOne({ where : { "email" : query.dataValues.email }});

    query.destroy();
    response.password = hashedPassword;

    response.save();

    res.json(response.dataValues);
    } catch (error) {
        console.log(error.message);
    }
})


module.exports = router;