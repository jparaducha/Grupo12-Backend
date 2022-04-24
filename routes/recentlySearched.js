const { Recently_searched } = require("../db");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { user_id, product_id } = req.body;

  const list = await Recently_searched.findOne({
    where: {
      user_id: user_id,
    },
  });

  if (!list) {
    Recently_searched.create({
      user_id,
      products: [product_id],
    }).then((list) => {
      return res.status(200).send(list);
    });
  } else {
    const tempArray = [];
    list.products.forEach((element) => {
      if (element != product_id) {
        tempArray.push(element);
      }
    });
    if (tempArray.length === 5) {
      tempArray.shift();
    }
    tempArray.push(product_id);
    await list.update({ products: tempArray });
    return res.status(200).send(list);
  }
});

//--------------------------------------------------------------

router.get("/", (req, res) => {
  const { user_id } = req.query;
  Recently_searched.findOne({
    where: {
      user_id: user_id,
    },
  }).then((list) => {
    if (list.products.length > 0) return res.status(200).send(list);
    return res.status(404).send("List non-existant or empty");
  });
});

module.exports = router;
