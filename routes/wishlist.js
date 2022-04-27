const { User, Wishlist, Product, Stock } = require("../db");

const router = require("express").Router();

//-----------------------------------------------------------------------------

router.post("/", async (req, res) => {
  try {
    const { user_id, product_id, seller_id } = req.body;

    const user = await User.findOne({
      where: {
        user_id: user_id,
      },
    }).catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });

    if (!user) return res.status(404).send("User not found");

    const product = await Product.findOne({
      where: {
        product_id: product_id,
      },
    }).catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });

    if (!product) return res.status(404).send("Product not found");

    const seller_stock = await Stock.findOne({
      where: {
        user_id: seller_id,
        product_id: product_id,
      },
    }).catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });

    if (!seller_stock) return res.status(404).send("Seller not found");

    user
      .addWishlists(product, {
        through: { product: product, seller_id: seller_id },
      })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).send(e.message);
      });
  } catch (e) {
    console.log(e);
    return res.status(400).send(e.message);
  }
});

//-----------------------------------------------------------------------------

router.get("/", async (req, res) => {
  const { user_id } = req.query;

  const result = [];

  await User.findOne({
    where: {
      user_id: user_id,
    },
  })
    .then((user) => {
      if (!user) return res.send.status(404).send("User not found ");
      return user.getWishlists();
    })
    .then((user_wishlist) => {
      user_wishlist.forEach((object) => {
        result.push(object.wishlist.product);
      });
      return res.send(result);
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });
});

//-----------------------------------------------------------------------------

router.delete("/", async (req, res) => {
  const { user_id, target, seller_id } = req.body;

  User.findOne({
    where: {
      user_id: user_id,
    },
  })
    .then((user) => {
      if (!user) return res.status(400).send("User not found");
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });

  User.findOne({
    where: {
      user_id: seller_id,
    },
  })
    .then((seller) => {
      if (!seller) return res.status(404).send("Seller not found");
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });

  if (!target) return res.status(400).send("Target not specified");

  if (target === "all") {
    Wishlist.destroy({
      where: {
        user_id: user_id,
      },
    })
      .then(() => {
        return res.status(200).send("User wishlist deleted");
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).send(e.message);
      });
  } else {
    await Product.findOne({
      where: {
        product_id: target,
      },
    }).then((product) => {
      if (!product) return res.send.status(404).send("Product not found ");
    });
    Wishlist.destroy({
      where: {
        user_id: user_id,
        product_id: target,
        seller_id: seller_id,
      },
    })
      .then(() => {
        return res
          .status(200)
          .send("Targeted product deleted from user wishlist");
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).send(e.message);
      });
  }
});

//-----------------------------------------------------------------------------

module.exports = router;
