const jwt = require("jsonwebtoken");
require("dotenv").config();


function jwtGenerator(user_id, user_email){

    let payload = {
        user: user_id,
        // email: user_email
    }

    return jwt.sign(payload, process.env.SECRET, { expiresIn: "1hr"}); // devuelve un token que está ligado al id del usuario;
}


module.exports = jwtGenerator;