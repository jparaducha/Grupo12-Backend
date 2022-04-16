# DOCS

<div>
    <div><h3>## Registro ##</h3></div>
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/auth/register' =  Recibe por body { "password" , "name" , "email" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si alguno de los valores está vacío devuelve un json "Missing credentials"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si el email no es un correo válido devuelve un json "Invalid Email"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Guarda la información en la DB (con la contraseña encriptada) y devuelve un jsonwebtoken;</div>
    </div>
<div>
    <div><h3>## Login ##</h3></div>
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/auth/login' = Recibe por body { "password" , "email" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si alguno de los valores está vacío devuelve un json "Missing credentials"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si el email no es un correo válido devuelve un json "Invalid Email"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve un jsonwebtoken;</div>
  </div>
  <div>
    <div><h3>## Autorización ##</h3></div>
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/auth/is-verify' = Recibe por body { "headers" : { "token" } }</h4></div>
    <div><h4>Recibe por headers { "token" }  </h4></div>
<div>Verifica que el jwt sea correcto</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve true si es correcto o "You are not authorized" si es incorrecto;</div>
    
 
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/dashboard' = Recibe por body { "headers" : { "token" } }</h4></div>
    <div><h4>Recibe por headers { "token" }  </h4></div>
<div>Verifica que el jwt sea correcto</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve un JSON con la información del usuario si es correcto o "You are not authorized" si es incorrecto;</div>
    </div>
  <div>
    <div><h3>## Cambio de contraseña ##</h3></div>
  <div> <h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/auth/forgot' = Recibe por body { "email" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Verifica que el email esté registrado, de lo contrario devuelve "Email no registrado"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Envía un correo con un código de 6 caracteres</div>
  </div>
    <div>
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/auth/changepassword' = Recibe por body { "password" , "token" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Verifica que el token recibido por correo no haya expirado ( 15 minutos desde el post en /forgot)</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si el no se encuentra el token en la db devuelve "token expirado"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si se encuentra el token pero ya expiró, lo elimina de la db y devuelve "Token expirado"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Cambia la contraseña del email asociado al token</div>
</div>

<div> <h3> ## MISC ## </h3></div>
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/dashboard' </h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve un arreglo con todos los usuarios</div>


 <div> <h3>## Productos ##</h3></div>
    
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/products'</h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve un arreglo con todos los productos de la db</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se le pasa por body "product_id" traeremos unicamente los datos de ese producto y un campo users con la informacion de los usuarios que publicaron stock de dicho producto</div>

<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/products/search' = Recibe por body { "search" }</h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve un arreglo con todos los productos de la db cuyo nombre matchee con search</div>
    
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/products' =  Recibe por body { "name" , "description" , "category_id" , "image" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si name, description o userId tienen valores nulos devuelve un json "Faltan datos"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un usuario con el userId devuelve un json "Usuario no encontrado"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si la userId no es del tipo "uuid" devuelve un json "Id de usuario no válida"</div>
<div>Si no se pasa stock se agrega un valor por default (1)</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Guarda la información en la DB y devuelve un json con los datos del producto</div>
    
    
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyaY6YSJzDJk0N6HK1yn-3pScT9mZMJVHQEY21Gjuy7PNaPuAb9QscIy53DiwR9XrSwuE&usqp=CAU"/> PATCH '/products' =  Recibe por body {  "id", "name" , "description" , "image" , "price" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no encuentra un producto son la id suministrada devuelve un json "Producto no encontrado"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Actualiza los datos del producto que se hayan pasado por body</div>
    
<div><h4><img width="25px" height="10px" src="https://w7.pngwing.com/pngs/898/809/png-transparent-rectangle-area-red-product-button-miscellaneous-rectangle-area.png"/>DELETE '/products' = Recibe por body { "id" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no encuentra un producto son la id suministrada devuelve un json "Producto no encontrado"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Marca el producto como no aprobado</div>

 <div> <h3>## Stock ##</h3></div>

 <div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/stock' =  Recibe por body { "user_id" , "product_id" , "quantity" , "unit_price" }</h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Agrega la cantidad "quantity" al precio de unidad "unit_price" al stock del producto con el id "product_id" a nombre del usuario con el id "user_id"</div>

 <div> <h3>## Category ##</h3></div>
  <div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/category' =  Recibe por body { "name" , "parent_id"}</h4></div>
  <div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si no se le pasa "parent_id" crea una categoria de nivel 0 con el nombre "name". Si se le pasa "parent_id" crea una subcategoria de la categoria con el category_id "parent_id".</div>
  <div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/category'</h4></div>
    <div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve todas las categorias {category_id , name , parent_id , timestamps}.</div>



