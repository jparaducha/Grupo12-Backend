const router = require("express").Router();
const { Product, User, Stock } = require("../db.js");

router.post("/", async (req, res) => {
  try {
    const { user_id, product_id, quantity, unit_price } = req.body;

    if (![user_id, product_id, quantity, unit_price].every(Boolean))
      return res.json("Error : Missing data in request");

    const user = await User.findOne({ where: { user_id: user_id } })
      .then((data) => {
        return data;
      })
      .catch((e) => console.log(e));

    if (!user) return res.status(204).send("Error : User not found");
    if (!user.provider)
      return res.status(400).send("Error : User not validated as provider");
    if (!user.active) return res.json("Error : User not active");

    //--------------------------------------------------------------------

    const product = await Product.findOne({ where: { product_id: product_id } })
      .then((data) => {
        return data;
      })
      .catch((e) => console.log(e));

    if (!product) return res.status(204).send("Error : Product not found");

    //--------------------------------------------------------------------

    const stockEntry = await Stock.findOne({
      where: { product_id: product_id, user_id: user_id },
    }).catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });

    //--------------------------------------------------------------------

    const currentStock = product.stock;
    product.stock = currentStock + quantity;
    await product.save().catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });

    //--------------------------------------------------------------------

    if (!stockEntry) {
      await user
        .addStocks(product, {
          through: { quantity: quantity, unit_price: unit_price },
        })
        .then((response) => {
          res.json(response);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      stockEntry.quantity = stockEntry.quantity + quantity;
      stockEntry.save().catch((e) => {
        console.log(e);
        return res.status(400).send(e.message);
      });
      res.json("Stock Agregado");
    }
    //--------------------------------------------------------------------
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (userId) {
      const stocks = await Stock.findAll({
        where: {
          user_id: userId,
        },
      })
        .then((data) => {
          return data;
        })
        .catch((e) => {
          console.log(e);
          return res.sendStatus(500);
        });

      return res.json(stocks);
    }

    const stocks = await Stock.findAll()
      .then((data) => {
        return data;
      })
      .catch((e) => {
        console.log(e);
        return res.sendStatus(500);
      });

    return res.json(stocks);
  } catch (error) {
    console.log(error.message);

    return res.sendStatus(500);
  }
});

module.exports = router;
