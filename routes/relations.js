const { Products_relations, Product } = require("../db");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { product_1_id, type, product_2_id } = req.body;

  await Product.findOne({ where: { product_id: product_2_id } }).then(
    (product) => {
      if (!product) return res.send.status(404).send("Product 2 not found ");
    }
  );
  await Product.findOne({ where: { product_id: product_1_id } }).then(
    (product) => {
      if (!product) return res.send.status(404).send("Product 1 not found ");
    }
  );

  Products_relations.create({
    product_1_id,
    type,
    product_2_id,
  })
    .then((relation) => {
      if (!relation)
        return res.send.status(404).send("Failed to create relation");
      return res.send(relation);
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });
});

//--------------------------------------------------------

router.get("/", async (req, res) => {
  const { product_id, type } = req.query;
  const result = [];

  await Product.findOne({ where: { product_id: product_id } }).then(
    (product) => {
      if (!product) return res.send.status(404).send("Product not found ");
    }
  );
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

  await Promise.all([promise1, promise2])
    .then((promise_result) => {
      promise_result.forEach((array) => {
        array.forEach((element) => {
          result.push(element);
        });
      });
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });

  return res.send(result);
});

//--------------------------------------------------------

module.exports = router;
