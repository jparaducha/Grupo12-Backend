const { promise } = require("bcrypt/promises");
const { Products_relations, Product } = require("../db");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { product_1_id, type, product_2_id } = req.body;

  Products_relations.create({
    product_1_id,
    type,
    product_2_id,
  }).then((relation) => {
    return res.send(relation);
  });
});

//--------------------------------------------------------

router.get("/", async (req, res) => {
  const { product_id, type } = req.query;
  const result = [];
  const promise1 = Products_relations.findAll({
    where: {
      product_1_id: product_id,
    },
  });
  const promise2 = Products_relations.findAll({
    where: {
      product_2_id: product_id,
    },
  });

  await Promise.all([promise1, promise2]).then((promise_result) => {
    promise_result.forEach((array) => {
      array.forEach((element) => {
        result.push(element);
      });
    });
  });

  return res.send(result);
});

//--------------------------------------------------------

module.exports = router;
