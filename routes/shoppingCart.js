const router = require("express").Router();
const { Shopping_cart, User, Product, Stock, sequelize } = require("../db");

//--------------------------------------------------------------------------------------------

router.get("/", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) return res.json("Error : Must provide a valid id");

    const user = await User.findOne({
      where: {
        user_id: id,
      },
    });

    if (!user) return res.status(404).send("Error : User not found");

    const cart = await Shopping_cart.findAll({ where: { buyer_id: id } });

    console.log(cart.length);
    if (cart.length == 0)
      return res.status(404).send("Error : User's cart is empty");

    return res.status(200).send(cart);
  } catch (error) {
    console.log(error.message);
  }
});

//--------------------------------------------------------------------------------------------

router.post("/", async (req, res) => {
  const { buyer_id, products } = req.body;

  if (!products) return res.json("Error : Missing products in request");
  if (!buyer_id) return res.json("Error : Missing buyer_id in request");
  if (!(typeof products !== Array))
    return res.json("Error : products is not an array");

  const productsToAdd = [];

  const result = [];

  const buyer = await User.findOne({ where: { user_id: buyer_id } });

  if (!buyer) return res.send("Error : Buyer not found ").status(404);

  for (let productToAdd of products) {
    var product = await Product.findOne({
      where: {
        product_id: productToAdd.product_id,
      },
    }).catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });
    if (!product)
      return res
        .send(`Error : Product with id=${productToAdd.product_id} not found`)
        .status(404);
    console.log("checking seller");
    var seller = await User.findOne({
      where: {
        user_id: productToAdd.user_id,
      },
    });
    if (!seller)
      return res
        .status(404)
        .send(
          `Error : Seller for product with id=${productToAdd.product_id} not found`
        );
    //------------------------------

    const stock = await Stock.findOne({
      where: {
        user_id: productToAdd.seller_id,
        product_id: productToAdd.product_id,
      },
    }).catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });
    if (!stock) return res.send.status(404).send("Error : Stock not found ");
    //------------------------------

    /*     stock.quantity = stock.quantity - productToAdd.quantity;
    stock.save();
    product.stock = product.stock - productToAdd.quantity;
    product.save();
 */
    //------------------------------
    if (stock.quantity < productToAdd.quantity)
      return res
        .status(400)
        .send(
          `Error : not enough stock on product with id ${productToAdd.product_id}`
        );

    const overwrite = await Shopping_cart.findOne({
      where: {
        buyer_id: buyer_id,
        product_id: productToAdd.product_id,
        seller_id: productToAdd.seller_id,
      },
    }).catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });

    if (overwrite) {
      overwrite.quantity = productToAdd.quantity;
      overwrite.product = product;
      overwrite.save();

      //------------------------------

      /*       stock.quantity = stock.quantity + productToAdd.quantity;
      stock.save();
      product.stock = product.stock + productToAdd.quantity;
      product.save(); */

      //------------------------------

      result.push(overwrite);
    } else {
      const cart = Shopping_cart.create({
        product: product,
        product_id: productToAdd.product_id,
        unit_price: stock.unit_price,
        buyer_id: buyer_id,
        quantity: productToAdd.quantity,
        seller_id: productToAdd.seller_id,
      });
      if (!cart)
        return res.send.status(404).send("Error : Failed to create cart");
      productsToAdd.push(cart);
    }
  }

  Promise.all(productsToAdd)
    .then((productsAdded) => {
      productsAdded.forEach((product) => {
        buyer.addShopping_cart(product);
        result.push(product);
      });
    })
    .then(() => {
      const toSend = {
        added: result,
      };
      return res.status(200).send(toSend);
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });
});

//--------------------------------------------------------------------------------------------

router.delete("/", async (req, res) => {
  const { buyer_id, seller_id, product_id } = req.body;

  if (!buyer_id || !seller_id || !product_id)
    return res.status(400).send("Error : Missing data in request");
  const product = await Product.findOne({
    where: {
      product_id: product_id,
    },
  });
  if (!product) return res.status(404).send("Error : Product not found");
  const buyer = await User.findOne({
    where: {
      user_id: buyer_id,
    },
  });
  if (!buyer) return res.status(404).send("Error : Buyer not found");
  const seller = await User.findOne({
    where: {
      user_id: seller_id,
    },
  });
  if (!seller) return res.status(404).send("Error : Seller not found");

  const cart = await Shopping_cart.findOne({
    where: {
      buyer_id: buyer_id,
      seller_id: seller_id,
      product_id: product_id,
    },
  });

  if (!cart) return res.status(404).send("Error : Item not found on cart");

  Shopping_cart.destroy({
    where: {
      buyer_id: buyer_id,
      seller_id: seller_id,
      product_id: product_id,
    },
  })
    .then((rowsDeleted) => {
      if (rowsDeleted === 1) {
        return res.status(200).send("Deleted succesfully");
      }
      return res.status(400).send("Delete unsuccesfull");
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });
});

//--------------------------------------------------------------------------------------------

router.patch("/", async (req, res) => {
  const { buyer_id, seller_id, product_id, newQuantity } = req.body;

  Shopping_cart.findOne({
    where: {
      buyer_id: buyer_id,
      seller_id: seller_id,
      product_id: product_id,
    },
  })
    .then((productInCart) => {
      if (!productInCart)
        return res.status(404).send("Producto no encontrado en el carrito");
      const stock = Stock.findOne({
        where: {
          product_id: product_id,
          seller_id: seller_id,
        },
      });
      productInCart.quantity = newQuantity;
      productInCart.save();
      return productInCart;
    })
    .then((productInCart) => {
      return res.status(200).send(productInCart);
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });
});

//--------------------------------------------------------------------------------------------

router.delete("/all/:id", async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    if (!id) return res.json("Must provide a valid id").status(422);

    const carts = await Shopping_cart.findAll({
      where: {
        buyer_id: id,
      },
    });

    if (!carts) return res.json("No carts found").status(404);

    carts.forEach(async (i) => {
      await i.destroy();
    });

    return res.json("Carts deleted");
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
