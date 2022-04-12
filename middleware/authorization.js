const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET } = process.env;

// middleware para darle autorización al usuario si quiere ingresar a ciertas rutas;

module.exports = async (req,res,next) => {
    try {
        const  jwtToken = req.header("token") || req.body.headers.token;
        if(!jwtToken) return res.status(403).send("You are not authorized");
        let payload = jwt.verify(jwtToken, SECRET); // payload = { user: user_id, email: user_email (si se agrega a la generación del jwt), iat, exp};

        req.user = payload.user; // guarda en req.user la id del usuario cuyo token fue verificado;

        next();
    } catch (error) {
        res.status(403).send("You are not authorized");
    }
}