const { Recently_searched, Product, User } = require("../db");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { user_id, product_id } = req.body;

  const list = await Recently_searched.findOne({
    where: {
      user_id: user_id,
    },
  });

  const user = await User.findOne({
    where: {
      user_id: user_id,
    },
  });

  if (!user) return res.status(204).send("Error: User not found");
  const product = await Product.findOne({
    where: {
      product_id: product_id,
    },
  });

  if (!product) return res.status(204).send("Error: Product not found");

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
    if (!list) return res.status(204).send("Error : no products found");
    const product_promises = [];
    list.products.forEach((product_id) => {
      product_promises.push(
        Product.findOne({
          where: {
            product_id: product_id,
          },
        }).then((product) => {
          return {
            product_id: product.dataValues.product_id,
            name: product.dataValues.name,
            rating: product.dataValues.rating,
            images: product.dataValues.images,
            category_name: product.dataValues.category_name,
            stock: product.dataValues.stock,
            price: product.dataValues.price,
            featured_seller: product.dataValues.featured_seller,
          };
        })
      );
    });
    Promise.all(product_promises).then((product_objects) => {
      (list.products = []),
        product_objects.forEach((obj) => {
          list.products.push(obj);
        });
      return res.status(200).send(list.products);
    });
  });
});

module.exports = router;
