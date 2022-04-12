# DOCS

<div>
    <div><h3>## Registro ##</h3></div>
<div><h4>POST '/auth/register' =  Recibe por body { "password" , "name" , "email" }</h4></div>
<div>Si alguno de los valores está vacío devuelve un json "Missing credentials"</div>
<div>Si el email no es un correo válido devuelve un json "Invalid Email"</div>
<div>Guarda la información en la DB (con la contraseña encriptada) y devuelve un jsonwebtoken;</div>
    </div>
<div>
    <div><h3>## Login ##</h3></div>
<div><h4>POST '/auth/login' = Recibe por body { "password" , "email" }</h4></div>
<div>Si alguno de los valores está vacío devuelve un json "Missing credentials"</div>
<div>Si el email no es un correo válido devuelve un json "Invalid Email"</div>
<div>Devuelve un jsonwebtoken;</div>
  </div>
  <div>
    <div><h3>## Autorización ##</h3></div>
<div><h4>GET '/auth/is-verify' = Recibe por body { "headers" : { "token" } }</h4></div>
<div>Verifica que el jwt sea correcto</div>
<div>Devuelve true si es correcto o "You are not authorized" si es incorrecto;</div>
    </div>
  <div>
    <div><h3>## Cambio de contraseña ##</h3></div>
  <div> <h4>POST '/auth/forgot' = Recibe por body { "email" }</h4></div>
<div>Verifica que el email esté registrado, de lo contrario devuelve "Email no registrado"</div>
<div>Envía un correo con un código de 6 caracteres</div>
  </div>
    <div>
<div><h4>POST '/auth/changepassword' = Recibe por body { "password" , "token" }</h4></div>
<div>Verifica que el token recibido por correo no haya expirado ( 15 minutos desde el post en /forgot)</div>
<div>Si el no se encuentra el token en la db devuelve "token expirado"</div>
<div>Si se encuentra el token pero ya expiró, lo elimina de la db y devuelve "Token expirado"</div>
<div>Cambia la contraseña del email asociado al token</div>
</div>
