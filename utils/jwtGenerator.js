const jwt = require("jsonwebtoken");
require("dotenv").config();


function jwtGenerator(user_id, user_email, admin, provider, name) {

    let payload = {
        user_id: user_id,
        email: user_email,
        isAdmin: admin,
        isProvider: provider,
        name: name
    }

    return jwt.sign(payload, process.env.SECRET, { expiresIn: "1hr" }); // devuelve un token que está ligado al id del usuario;
}


module.exports = jwtGenerator;