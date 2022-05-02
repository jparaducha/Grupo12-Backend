const { Products_relations, Product, User } = require("../db");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { product_1_id, type, product_2_id } = req.body;

  if (!product_1_id || !type || !product_2_id)
    return res.status(400).send("Error : Missing data in request");
  if (type != "SIMILAR") {
    if (type != "COMPLEMENTARY") {
      return res.status(400).send("Error : type of relation unknown");
    }
  }

  const relation = await Products_relations.findOne({
    where: {
      product_1_id,
      type,
      product_2_id,
    },
  });

  if (relation) return res.status(400).send("Error : relation already exists");

  const product_2 = await Product.findOne({
    where: { product_id: product_2_id },
  });

  if (!product_2) return res.status(204).send("Product 2 not found ");

  const product_1 = await Product.findOne({
    where: { product_id: product_1_id },
  });

  if (!product_1) return res.send.status(204).send("Product 1 not found ");

  Products_relations.create({
    product_1_id,
    type,
    product_2_id,
  })
    .then((relation) => {
      if (!relation)
        return res.send.status(400).send("Failed to create relation");
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
  var promise1, promise2;
  const product = await Product.findOne({ where: { product_id: product_id } });
  if (!product) return res.status(204).send("Error : Product not found ");

  if (!type) {
    promise1 = Products_relations.findAll({
      where: {
        product_1_id: product_id,
      },
    });
    promise2 = Products_relations.findAll({
      where: {
        product_2_id: product_id,
      },
    });
  } else {
    if (type != "SIMILAR") {
      if (type != "COMPLEMENTARY") {
        return res.status(400).send("Error : type of relation unknown");
      }
    }
    promise1 = Products_relations.findAll({
      where: {
        product_1_id: product_id,
        type: type,
      },
    });
    promise2 = Products_relations.findAll({
      where: {
        product_2_id: product_id,
        type: type,
      },
    });
  }
  await Promise.all([promise1, promise2])
    .then((promise_result) => {
      const product_promises = [];
      promise_result.forEach((array) => {
        array.forEach((element) => {
          var toSearch = {};
          if (element.dataValues.product_1_id == product_id) {
            toSearch.related_product_id = element.dataValues.product_2_id;
          } else {
            toSearch.related_product_id = element.dataValues.product_1_id;
          }
          const product_promise = Product.findOne({
            where: { product_id: toSearch.related_product_id },
            include: {
              model: User,
              as: "sellers",
              attributes: ["user_id", "name", "rating_as_seller"],
            },
          }).then((promise) => {
            return {
              type: element.dataValues.type,
              product_promise_result: promise,
            };
          });
          product_promises.push(product_promise);
        });
      });
      Promise.all(product_promises).then((promises_snapshot) => {
        const result = [];
        if (promises_snapshot.length === 0)
          return res.status(204).send("Error : No related products found");
        promises_snapshot.forEach(async (product) => {
          let totalStock = 0;
          if (product.product_promise_result.sellers.length !== 0) {
            product.product_promise_result.sellers.map((seller) => {
              if (!product.product_promise_result.featured_seller) {
                product.product_promise_result.featured_seller = seller;
              }
              if (
                seller.rating_as_seller >
                product.product_promise_result.featured_seller.rating_as_seller
              ) {
                product.product_promise_result.featured_seller = seller;
              }
              totalStock += seller.stock.quantity;
            });
            product.product_promise_result.stock = totalStock;
            product.product_promise_result.price =
              product.product_promise_result.featured_seller.stock.unit_price;
            const final_featured_seller_stock = {
              quantity:
                product.product_promise_result.featured_seller.stock.quantity,
              unit_price:
                product.product_promise_result.featured_seller.stock.unit_price,
            };
            const final_featured_seller = {
              user_id: product.product_promise_result.featured_seller.user_id,
              name: product.product_promise_result.featured_seller.name,
              rating_as_seller:
                product.product_promise_result.featured_seller.rating_as_seller,
              stock: final_featured_seller_stock,
            };
            product.product_promise_result.save();
            const product_to_return = {
              product_id: product.product_promise_result.product_id,
              name: product.product_promise_result.name,
              rating: product.product_promise_result.rating,
              images: product.product_promise_result.images,
              category_name: product.product_promise_result.category_name,
              stock: product.product_promise_result.stock,
              price: product.product_promise_result.price,
              featured_seller: final_featured_seller,
              typeof_relation: product.type,
            };
            result.push(product_to_return);
          } else {
            const product_to_return = {
              product_id: product.product_promise_result.product_id,
              name: product.product_promise_result.name,
              rating: product.product_promise_result.rating,
              images: product.product_promise_result.images,
              category_name: product.product_promise_result.category_name,
              stock: 0,
              price: null,
              typeof_relation: product.product_promise_result.type,
            };
            result.push(product_to_return);
            console.log(result);
          }
        });
        return res.send(result);
      });
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });
});

//--------------------------------------------------------

router.delete("/", async (req, res) => {
  const { product_1_id, type, product_2_id } = req.body;

  if (!product_1_id || !product_2_id || !type)
    return res.status(400).send("Error : Missing data in request");
  const product_1 = await Product.findOne({
    where: {
      product_id: product_1_id,
    },
  });

  const product_2 = await Product.findOne({
    where: {
      product_id: product_2_id,
    },
  });

  if (!product_1) return res.status(204).send("Error: Product 1 not found");
  if (!product_2) return res.status(204).send("Error: Product 2 not found");

  if (type !== "SIMILAR") {
    if (type !== "COMPLEMENTARY") {
      return res.status(400).send("Error: type of relation unknown");
    }
  }

  const relation = await Products_relations.findOne({
    where: {
      product_1_id: product_1_id,
      type: type,
      product_2_id: product_2_id,
    },
  });
  if (!relation) return res.status(204).send("Error: relation not found");

  await relation.destroy();

  return res.status(200).send("Relation succesfully deleted");
});

module.exports = router;
