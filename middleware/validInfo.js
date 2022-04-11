module.exports = function(req, res, next) {
  
    // console.log("recibe validInfo en body:", req.body);
      const { email, name, password } = req.body;  // recibe los elementos por body;
  
    
      function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail); // regex para verificar que sea un email;
      }
    
      if (req.path === "/register") {  // entra en este bloque si la ruta es /register;
        if (![email, name, password].every(Boolean)) { // con Boolean() verifica que las strings no esten vacías; si están vacías entra en este bloque y devuelve el json;
  
          return res.json("Missing Credentials");
        } else if (!validEmail(email)) { // si las strings no están vacías verifica que el email sea válido;
          return res.json("Invalid Email");
        }
      } else if (req.path === "/login") {  // entra en este bloque si la ruta es /login;
        if (![email, password].every(Boolean)) { // con Boolean() verifica que las strings no esten vacías; si están vacías entra en este bloque y devuelve el json;
          return res.status(503).json("Missing Credentials");
        } else if (!validEmail(email)) { // si las strings no están vacías verifica que el email sea válido;
          return res.status(503).json("Invalid Email");
        }
      }
    
      next();  // si todo está correcto salta a la siguiente ruta;
    };
  
  
    // middleware para verificar la información que se envía a la hora de autenticar;