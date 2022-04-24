const { RecentlySearched } = require("../db");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { user_id, product_id } = req.body;

  const list = await RecentlySearched.findOne({
    where: {
      user_id: user_id,
    },
  });

  if (!list) {
    RecentlySearched.create({
      user_id,
      products: [product_id],
    }).then((list) => {
      return res.status(200).send(list);
    });
  } else {
    if (list.products.length >= 5) {
      list.product.shift();
    }
    list.product.push(product_id);
    list.save();
    return res.status(200).send(list);
  }
});

//--------------------------------------------------------------

router.get("/", (req, res) => {
  const { user_id } = req.query;
  RecentlySearched.findOne({
    where: {
      user_id: user_id,
    },
  }).then((list) => {
    if (list.length > 1) return res.status(200).send(list);
    return res.status(404).send("List non-existant or empty");
  });
});

module.exports = router;
