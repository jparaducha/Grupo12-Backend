var mercadopago = require("mercadopago");
const { Stock, Shopping_cart } = require("../db");
require("dotenv").config();
const mainPage = "https://hubazar.vercel.app/"

mercadopago.configurations.setAccessToken(process.env.MERCADOPAGOACCESSTOKEN);
mercadopago.configure({
  access_token: process.env.MERCADOPAGOACCESSTOKEN
});

const crearOrden = async (req, res, next) => {
  try {
    // Crea un objeto de preferencia
    //
    const { id, unit_price, bookRef, buyer } = req.body;


    const carts = await Shopping_cart.findAll({
      where: {
        buyer_id: buyer
      }
    });

    if (!carts) return res.json('There are no carts')

    var cardDenied = [];

    for (let i of carts) {
      let qty = i.quantity;
      let seller = i.seller_id;
      let productId = i.product_id;
      let name = i.product.name

      let stock = await Stock.findOne({
        where: {
          user_id: seller,
          product_id: productId
        }
      })

      let stockQty = stock.quantity;
      if (stockQty < qty) {
        cardDenied.push(name)
      }
    }
    if (cardDenied.length) {
      return res.json({
        message: 'Multiple products exceeded our stock',
        Items: cardDenied
      }).status(409)
    }

    const totalPrice = carts.reduce((acc, curr) => {
      return acc + (curr.unit_price * curr.quantity);
    }, 0);





    if (!totalPrice) return res.json("Empty cart");

    let preference = {
      items: [
        {
          title: "Checkout",
          unit_price: totalPrice,
          quantity: 1,
          currency_id: "ARS",
          category_id: "Ecommerce",
          description: "Cart checkout"
        },
      ],
      back_urls: {
        success: `${mainPage}mp_confirmation`,
        failure: mainPage + 'cart',
      },
      auto_return: "approved",
      binary_mode: true,
      external_reference: buyer,
    };

    mercadopago.preferences
      .create(preference)
      .then(async (response) => {

        const { body } = response;

        res.json(response.body.init_point);
      })
      .catch(function (error) {
        next(error);
      })

  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500)
  }
}

const notificacionOrden = async (req, res) => {
  try {
    const { query } = req;

    console.log(query);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

module.exports = { crearOrden, notificacionOrden }