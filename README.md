# Grupo12-Backend


POST '/auth/register' =  Recibe por body { "password" , "name" , "email" }
Si alguno de los valores está vacío devuelve un json "Missing credentials"
Si el email no es un correo válido devuelve un json "Invalid Email"
Guarda la información en la DB (con la contraseña encriptada) y devuelve un jsonwebtoken;

POST '/auth/login' = Recibe por body { "password" , "email" }
Si alguno de los valores está vacío devuelve un json "Missing credentials"
Si el email no es un correo válido devuelve un json "Invalid Email"
Devuelve un jsonwebtoken;

GET '/auth/is-verify' = Recibe por body { "headers" : { "token" } }
Verifica que el jwt sea correcto
Devuelve true si es correcto o "You are not authorized" si es incorrecto;

POST '/auth/forgot' = Recibe por body { "email" }
Verifica que el email esté registrado, de lo contrario devuelve "Email no registrado"
Envía un correo con un código de 6 caracteres

POST '/auth/changepassword' = Recibe por body { "password" , "token" }
Verifica que el token recibido por correo no haya expirado ( 15 minutos desde el post en /forgot)
Si el no se encuentra el token en la db devuelve "token expirado"
Si se encuentra el token pero ya expiró, lo elimina de la db y devuelve "Token expirado"
Cambia la contraseña del email asociado al token
