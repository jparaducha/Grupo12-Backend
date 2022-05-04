# DOCS

<div>
    <div><h3>## Registro ##</h3></div>
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/auth/register' =  Recibe por body { "password" , "name" , "email" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si alguno de los valores está vacío devuelve un json "Missing credentials"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si el email no es un correo válido devuelve un json "Invalid Email"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Guarda la información en la DB (con la contraseña encriptada), envía un correo de confirmación y devuelve un json "Mail sent";</div>
    
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/auth/verify' = Recibe por query { "token" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no existe el token  devuelve un json "Token not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra el usuario devuelve un json "User not found"</div> 
    
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Verifica al usuario en la DB y devuelve un token con su información;</div>
   
    
<div>
    <div><h3>## Login ##</h3></div>
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/auth/login' = Recibe por body { "password" , "email" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si alguno de los valores está vacío devuelve un json "Missing credentials"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si el email no es un correo válido devuelve un json "Invalid Email"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si el email no está verificado devuelve un json "Inactive account"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve un jsonwebtoken con información del usuario;</div>
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

 <div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/products/load'</h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Agrega productos a la DB con un usuario previamente creado</div>

 <div> <h3>## Productos ##</h3></div>
    
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/products' recibe por body = { "product_id" , "order" }</h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve un arreglo con todos los productos de la db</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se le pasa por body "product_id" traeremos unicamente los datos de ese producto y un campo users con la informacion de los usuarios que publicaron stock de dicho producto</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se especifica un "order" devuelve un arreglo con todas los productos de la categoría ordenados de la forma solicitada ( "nameASC" "nameDESC" "priceASC" "priceDESC" "oldest" "newest" "ratingASC" "ratingDESC" )</div>

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

<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/products/categories' = Recibe por body { "type"  , "order" }</h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si no se especifica un "type" devuelve un arreglo con todas las categorías en forma de string</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se especifica un "type" pero no un "order" devuelve un arreglo con todas los productos de la categoría</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se especifica un "type" y un "order" devuelve un arreglo con todas los productos de la categoría ordenados de la forma solicitada ( "nameASC" "nameDESC" "priceASC" "priceDESC" "oldest" "newest" "ratingASC" "ratingDESC" )</div>

 <div> <h3>## Stock ##</h3></div>

 <div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/stock' =  Recibe por body { "user_id" , "product_id" , "quantity" , "unit_price" }</h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Agrega la cantidad "quantity" al precio de unidad "unit_price" al stock del producto con el id "product_id" a nombre del usuario con el id "user_id"</div>

 <div> <h3>## Category ##</h3></div>
  <div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/category' =  Recibe por body { "name" , "parent_id"}</h4></div>
  <div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si no se le pasa "parent_id" crea una categoria de nivel 0 con el nombre "name". Si se le pasa "parent_id" crea una subcategoria de la categoria con el category_id "parent_id".</div>
  <div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/category'</h4></div>
    <div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve todas las categorias {category_id , name , parent_id , timestamps}.</div>
    
    
    
<h3>## Admin ##</h3>
    
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/admin/delete' =  Recibe por body {  "userId", "productId" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si userId no es una UUID válida  devuelve un json "User ID must be an UUID"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se pasan valores en userId ni productId devuelve un json "Invalid inputs"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si el productId no pertenece a ningún producto devuelve un json "Product not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si el userId no pertenece a ningún usuario devuelve un json "User not found"</div>
    
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si productId y userId son válidos se desasocian el usuario y el producto y devuelve un json "User unassociated from product"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si sólo se pasa productId y es válida se elimina el producto y devuelve un json "Product deleted"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si sólo se pasa userId y es válida se borra el usuario y devuelve un json "User deleted"</div>
    
    
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/admin/ban' =  Recibe por body {  "userId" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si userId no es una UUID válida  devuelve un json "User ID must be an UUID"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se pasan valores en userId devuelve un json "Invalid inputs"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se pasa una userId válida se cambia el estado "active" del usuario a false y devuelve un json "Account deactivated"</div>

<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/admin/unban' =  Recibe por body {  "userId" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se pasan valores en userId devuelve un json "Invalid inputs"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se pasa una userId válida se cambia el estado "active" del usuario a true y devuelve un json "Account activated"</div>
    
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/admin/approve/:productId' =  Recibe por params {  "productId" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra el producto devuelve un json "Product not found"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se pasa una productId válida se cambia el estado "approved" del producto a true y devuelve un json "Product approved"</div>
    
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/admin/disapprove/:productId' =  Recibe por params {  "productId" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra el producto devuelve un json "Product not found"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se pasa una productId válida se cambia el estado "approved" del producto a false y devuelve un json "Product disapproved"</div>

<h3>## Shopping Cart ##</h3>
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/cart' = Recibe por query { id } del usuario </h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra el usuario devuelve un json "User not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentran productos en el carrito del usuario devuelve un json "User's cart is empty"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se pasa una id válida y el usuario tiene productos en el carrito se devuelve un array con todos los productos en el carrito
<div>
<h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/cart' =  Recibe por body {  "buyer_id" , "products" } donde products es un array de productos de la forma {product_id,seller_id,quantity}</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra el usuario comprador devuelve un json "Error : Missing buyer_id in request"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra products devuelve un json "Error : Missing products in request"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si products no es un array devuelve un json "Error : products is not an array"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se cumplen las condiciones retorna un JSON con una propiedad "added" que consiste en un array de los productos que se añadieron exitosamente al carrito, y otra propiedad "not added" que consiste en un array de los productos que ya sea porque no se encontro el producto o no hay stock no se pudieron añadir al carro  //// si se pasa un producto repetido(que ya es encuentra en el carro) se sobreescribira la cantidad, es decir se cambiara la cantidad vieja por la nueva
<div>

<div><h4><img width="25px" height="10px" src="https://w7.pngwing.com/pngs/898/809/png-transparent-rectangle-area-red-product-button-miscellaneous-rectangle-area.png"/>DELETE '/cart' = Recibe por body { "buyer_id" , "seller_id" , "product_id" }</h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Elimina el producto especificado del carrito</div>

<h3>## Wishlist ##</h3>
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/wishlist' = Recibe por query { user_id } del usuario </h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Retorna todos los productos en la wishlist del usuario</div>
<h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/wishlist' =  Recibe por body {  "user_id" , "product_id", "seller_id" } </h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Agrega el producto especificado a la wishlist del usuario</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un usuario activo con la user_id pasada por body devuelve un json "Error : User not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un producto activo con la product_id pasada por body devuelve un json "Error : Product not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un usuario activo la seller_id pasada por body devuelve un json "Error : Seller not found"</div>
<div><h4><img width="25px" height="10px" src="https://w7.pngwing.com/pngs/898/809/png-transparent-rectangle-area-red-product-button-miscellaneous-rectangle-area.png"/>DELETE '/wishlist' = Recibe por body { "user_id" , "seller_id" , "target" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un usuario activo con la user_id pasada por body devuelve un json "Error : User not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un usuario activo la seller_id pasada por body devuelve un json "Error : Seller not found"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si target es "all" se eliminaran todos los productos en la wishlist del usuario especificado</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si target no es "all" se tratara como una product_id y eliminara el producto especificado de la wishlist del usuario</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un producto activo con la product_id pasada por body devuelve un json "Error : Product not found"</div>
<h3>## Relations ##</h3>
<h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/relations' =  Recibe por body {  "product_1_id" , "product_2_id", "type" } donde product_1_id y product_2_id son las id de los productos a relacionar y type es el tipo de relacion que tienen, type puede tomar "SIMILAR" O "COMPLEMENTARY"</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra toda la informacion necesaria en la request devuelve un JSON 'Error : Missing data in request'</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si type no es "SIMILAR" o "COMPLEMENTARY" devuelve un JSON 'Error : Type of relation unknown'</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si la relacion ya existe devuelve un JSON 'Error : relation already exists'</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un producto activo con la product_1_id pasada por body devuelve un json "Error : Product 1 not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un producto activo con la product_2_id pasada por body devuelve un json "Error : Product 2 not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si hay algun otro tipo de problema con la creacion de la relacion devuelve un JSON "Failed to create relation"</div>
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/relations' = Recibe por query { product_id , type } donde type es un parametro opcional </h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se especifica type, entonces devolvera todas las relaciones de ese tipo del producto especificado en un array de productos relacionados de la misma forma que en get '/products' con la adicion de un campo 'typeof_relation' que especifica el tipo de relacion del producto con el especificado por query  // Si no se especifica type, entonces retornara todas las relaciones de ese producto indistintamente de su type </div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un producto activo con la product_id pasada por query devuelve un json "Error : Product not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si type no es "SIMILAR" o "COMPLEMENTARY" devuelve un JSON 'Error : Type of relation unknown'</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentran devuelve un JSON 'Error : Type of relation unknown'</div>
<div><h4><img width="25px" height="10px" src="https://w7.pngwing.com/pngs/898/809/png-transparent-rectangle-area-red-product-button-miscellaneous-rectangle-area.png"/>DELETE '/relations' = Recibe por body { "product_1_id" , "type" , "product_2_id" }</h4></div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un producto activo con la product_1_id pasada por body devuelve un json "Error : Product 1 not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra un producto activo con la product_2_id pasada por body devuelve un json "Error : Product 2 not found"</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si type no es "SIMILAR" o "COMPLEMENTARY" devuelve un JSON 'Error : Type of relation unknown'</div>
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra toda la informacion necesaria en la request devuelve un JSON 'Error : Missing data in request'</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se elimino exitosamente la relacion devolvera un JSON "Relation succesfully deleted" </div>
<h3>## Recent ##</h3>

<h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/recent' =  Recibe por body {  "product_id" , "user_id" }
</h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Almacena los ultimos 5 product_ids pasados por cada user_id </div>

<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/recent' = Recibe por query { user_id } Devuelve un array de los productos </h4></div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve un array de los productos asociados al usuario especificado </div>

<h3> ## Movements ## </h3>
    
    
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/movement/:userId' = Recibe por params { userId } </h4></div>
   
    
   
    
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve un arreglo con los movimientos del comprador</div>
    
    
      
<div><h4><img height="10px" width="25px" src="https://www.ulsterceramicspotterysupplies.co.uk/wp-content/uploads/2017/10/4118.png"/> POST '/movement/review' =  Recibe por query {  "orderId" }</h4></div> 
<div><h4> Recibe por body {  "review", "stars" , "sellerStars" } "review" del tipo string, "stars" y "sellerStars" del tipo entero. Siendo "stars" la puntuación del producto y "sellerStars" la puntuación al vendedor. </h4></div>
    
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se pasa una orderId devuelve un JSON "An order id must be provided"</div>
    
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se pasa una review devuelve un JSON "Missing review"</div>
    
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra el movimiento devuelve un JSON "movement not found"</div>

<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Agrega "sellerStars" al vendedor como rating </div>
    
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Agrega "stars" al producto como rating </div>
    
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Guarda la review en "notes" y cambia el campo "rated" a true. Devuelve un JSON "Review saved" </div>
    
    
    
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyaY6YSJzDJk0N6HK1yn-3pScT9mZMJVHQEY21Gjuy7PNaPuAb9QscIy53DiwR9XrSwuE&usqp=CAU"/> PATCH '/movement/notification' =  Recibe por query {  "userId" }</h4></div>
    
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se pasa una userId devuelve un JSON "Missing user id"</div>
    
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si el usuario no tiene movimientos devuelve un JSON "User has no moves"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Actualiza los campos "seen" de todos los movimientos del usuario a "true". Devuelve un JSON "Movements seen" </div>
    
    
    
    
    
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyaY6YSJzDJk0N6HK1yn-3pScT9mZMJVHQEY21Gjuy7PNaPuAb9QscIy53DiwR9XrSwuE&usqp=CAU"/> PATCH '/movement/status' =  Recibe por query {  "orderId" }</h4></div>
    
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se pasa una orderId devuelve un JSON "Must provide an order id"</div>
    
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si el movimiento no existe devuelve un JSON "Movement not found"</div>
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Cambia el campo "type" de "SALE" a "SENT" o de "SENT" a "RECEIVED". Devuelve un JSON "Movement marked as (sent o received, respectivamente)".
Si el movimiento ya está con type= "RECEIVED. Devuelve un JSON "Movement is RECEIVED" </div>
    

    
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1_PEAPdXyverhNPGppuIntV-fwM3EUYzVettELm6trP0QY9wsUNo4umN59cEPexJWvQ&usqp=CAU"/> GET '/movement/reviews' = Recibe por query { productId } </h4></div>
   
    
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Devuelve un arreglo con las reviews del producto de la forma:</div>
    
<div><h5>[   { "review" : "Buen producto", "rating" : 2 }  , { "review" : "Malaso" , "rating" : 5 } , {...} , ...] </h5></div>
    
    

<h3> ## Crear proveedor ## </h3>
    
    
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyaY6YSJzDJk0N6HK1yn-3pScT9mZMJVHQEY21Gjuy7PNaPuAb9QscIy53DiwR9XrSwuE&usqp=CAU"/> PATCH '/dashboard/provider' = Recibe por query { userId } </h4></div>
    
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se pasa una userId devuelve un JSON "Must provide an user id"</div>
   
 <div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra el usuario devuelve un JSON "User not found"</div>
    
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Cambia la propiedad "provider" del usuario a "requested"</div>
    
    
      
<div><h4><img width="25px" height="10px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyaY6YSJzDJk0N6HK1yn-3pScT9mZMJVHQEY21Gjuy7PNaPuAb9QscIy53DiwR9XrSwuE&usqp=CAU"/> PATCH '/admin/giveProvider/:userId' = Recibe por params { userId } 
  Recibe por query = { rejected } </h4></div>
    
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se pasa una userId devuelve un JSON "Must provide an user id"</div>
        
<div><img width="15px" height="15px" src="https://i.dlpng.com/static/png/6330023_preview.png"/> Si no se encuentra el usuario devuelve un JSON "User not found"</div>
    
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Si se pasa "rejected" por query con algún valor (string no vacía) se rechaza la petición del usuario y su estado de provider pasa a false </div>
    
<div><img width="15px" height="15px" src="https://icons-for-free.com/download-icon-approval-131964752335548226_512.png"/> Invierte el valor booleano de la propiedad "provider". Devuelve un JSON "User made a provider" o "User is no longer a provider", respectivamente </div>
    

