const router = require("express").Router();
const { Op } = require("sequelize");
const {
  Product,
  Shopping_cart,
  User,
  image,
  Category,
  Stock,
  sequelize,
} = require("../db");

//------------------------------------------------------------------------------------------

router.get("/", async (req, res) => {
  try {
    const { product_id, order } = req.query;

    if (product_id) {
      Product.findOne({
        where: {
          product_id: product_id,
        },
        include: {
          model: User,
          as: "sellers",
          attributes: ["user_id", "name", "rating_as_seller"],
        },
      })
        .then(async (product) => {
          if (!product)
            return res.status(404).send("Error : product not found");
          let totalStock = 0;
          product.sellers.map((seller) => {
            if (!product.featured_seller) {
              product.featured_seller = seller;
            }
            if (
              seller.rating_as_seller > product.featured_seller.rating_as_seller
            ) {
              product.featured_seller = seller;
            }
            totalStock += seller.stock.quantity;
          });
          product.stock = totalStock;
          product.price = product.featured_seller.stock.unit_price;
          const final_featured_seller_stock = {
            quantity: product.featured_seller.stock.quantity,
            unit_price: product.featured_seller.stock.unit_price,
          };
          const final_featured_seller = {
            user_id: product.featured_seller.user_id,
            name: product.featured_seller.name,
            rating_as_seller: product.featured_seller.rating_as_seller,
            stock: final_featured_seller_stock,
          };
          return {
            product_id: product.product_id,
            name: product.name,
            rating: product.rating,
            images: product.images,
            category_name: product.category_name,
            stock: product.stock,
            price: product.price,
            featured_seller: final_featured_seller,
          };
        })
        .then((result) => {
          return res.status(200).send(result);
        });
    } else {
      const products = await Product.findAll({
        include: {
          model: User,
          as: "sellers",
          attributes: ["user_id", "name", "rating_as_seller"],
        },
      });
      const result = [];
      if (products.length === 0)
        return res.status(404).send("No products found");
      products.forEach(async (product) => {
        let totalStock = 0;
        product.sellers.map((seller) => {
          if (!product.featured_seller) {
            product.featured_seller = seller;
          }
          if (
            seller.rating_as_seller > product.featured_seller.rating_as_seller
          ) {
            product.featured_seller = seller;
          }
          totalStock += seller.stock.quantity;
        });
        product.stock = totalStock;
        product.price = product.featured_seller.stock.unit_price;
        const final_featured_seller_stock = {
          quantity: product.featured_seller.stock.quantity,
          unit_price: product.featured_seller.stock.unit_price,
        };
        const final_featured_seller = {
          user_id: product.featured_seller.user_id,
          name: product.featured_seller.name,
          rating_as_seller: product.featured_seller.rating_as_seller,
          stock: final_featured_seller_stock,
        };
        product.save();
        const product_to_return = {
          product_id: product.product_id,
          name: product.name,
          rating: product.rating,
          images: product.images,
          category_name: product.category_name,
          stock: product.stock,
          price: product.price,
          featured_seller: final_featured_seller,
          sellers: product.sellers,
        };
        result.push(product_to_return);
      });

      if (order === "nameASC") {
        return res.json(
          result.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (b.name < a.name) return 1;
            return 0;
          })
        );
      }

      if (order === "nameDESC") {
        return res.json(
          result.sort((a, b) => {
            if (a.name > b.name) return -1;
            if (b.name > a.name) return 1;
            return 0;
          })
        );
      }

      if (order === "priceASC") {
        return res.json(
          result.sort((a, b) => {
            if (a.price < b.price) return -1;
            if (b.price < a.price) return 1;
            return 0;
          })
        );
      }

      if (order === "priceDESC") {
        return res.json(
          result.sort((a, b) => {
            if (a.price > b.price) return -1;
            if (b.price > a.price) return 1;
            return 0;
          })
        );
      }
      if (order === "oldest") {
        return res.json(
          result.sort((a, b) => {
            if (a.added < b.added) return -1;
            if (b.added < a.added) return 1;
            return 0;
          })
        );
      }

      if (order === "newest") {
        return res.json(
          result.sort((a, b) => {
            if (a.added > b.added) return -1;
            if (b.added > a.added) return 1;
            return 0;
          })
        );
      }

      if (order === "ratingASC") {
        return res.json(
          result.sort((a, b) => {
            if (a.rating < b.rating) return -1;
            if (b.rating < a.rating) return 1;
            return 0;
          })
        );
      }

      if (order === "ratingDESC") {
        return res.json(
          result.sort((a, b) => {
            if (a.rating > b.rating) return -1;
            if (b.rating > a.rating) return 1;
            return 0;
          })
        );
      }

      return res.json(result);
    }
  } catch (error) {
    console.log(error.message);
  }
});

//------------------------------------------------------------------------------------------

router.get("/search", async (req, res) => {
  try {
    const { search } = req.query;

    const products = await Product.findAll({
      where: { name: { [Op.iLike]: `%${search}%` } },
    });

    res.json(products);
  } catch (error) {
    console.log(error.message);
  }
});

//------------------------------------------------------------------------------------------

router.post("/", async (req, res) => {
  try {
    const { name, description, category_name, image } = req.body;

    const rating = (Math.random() * 5).toFixed(2);

    if (![name, description].every(Boolean)) return res.json("Faltan datos");

    const productSearch = await Product.findOne({
      where: { name: name },
    });

    if (productSearch) return res.json("El producto ya esta listado");

    const category = await Category.findOne({
      where: { name: category_name },
    });

    if (!category)
      return res.status(400).send("La categoria seleccionada no existe");

    const response = await Product.create({
      name,
      description,
      category_name,
      images: image,
      added: new Date(Date.now()),
      rating,
    })
      .then((response) => {
        return response;
      })
      .catch((e) => console.log(e));
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
});

//------------------------------------------------------------------------------------------

router.patch("/", async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      approved,
      price,
      image,
      category,
      category_name,
    } = req.body;

    let product = await Product.findOne({ where: { product_id: id } });

    if (!product) return res.json("Producto no encontrado");

    if (name) product.name = name;
    if (description) product.description = description;
    if (image) product.image = image;
    if (price) product.price = price;
    if (approved) product.approved = approved;
    if (category) product.category = category;
    if (category_name) product.category_name = category_name;

    await product.save();

    res.json(product);
  } catch (error) {
    console.log(error.message);
  }
});

//------------------------------------------------------------------------------------------

router.delete("/", async (req, res) => {
  try {
    const { id } = req.body;

    let product = await Product.findOne({ where: { product_id: id } })
      .then((data) => {
        return data;
      })
      .catch((e) => console.log(e));

    if (!product) return res.json("Producto no encontrado");

    product.approved = false;
    await product.destroy();

    res.send("product deleted");
  } catch (error) {
    console.log(error.message);
  }
});

//------------------------------------------------------------------------------------------

router.post("/load", async (req, res) => {
  try {
    const json = require("../utils/products.json");

    const user = await User.findOne();

    json.forEach(async (i) => {
      const product = await Product.create({
        name: i.name,
        description: i.description,
        rating: i.rating,
        images: i.image,
        // "category" : i.category_name,
        added: new Date(Date.now()),
      })
        .then((data) => {
          return data;
        })
        .catch((e) => {
          console.log(e.message);
        });

      /// ????????????????????????????? ///////
      /// ????????????????????????????? ///////

      const category = await Category.findOne({
        where: {
          name: i.category_name,
        },
      })
        .then((data) => {
          return data;
        })
        .catch((e) => {
          console.log(e);
        });

      product.setCategories(category);

      /// ????????????????????????????? ///////
      /// ????????????????????????????? ///////

      user
        .addStocks(product, { through: { quantity: 1, unit_price: i.price } })
        .then((data) => {
          return data;
        })
        .catch((e) => {
          console.log(e.errors);
        });
    });
    return res.sendStatus(200);
  } catch (e) {
    console.log(e.message);
  }
});

//------------------------------------------------------------------------------------------

router.get("/categories/", async (req, res) => {
  try {
    let { name, order } = req.query;

    if (!name) {
      return res.status(400).send("Missing category name");
    }

    let result = [];

    async function recursive(category_name) {
      var productsToReturn = [];
      var categories = [];

      await Product.findAll({
        where: {
          category_name: category_name,
        },
      })
        .then((data) => {
          data.forEach((product) => {
            result.push(product.dataValues);
          });
        })
        .catch((e) => {
          console.log(e);
        });
      //-----------------------------------
      await Category.findOne({
        where: { name: category_name },
      })
        .then(async (category) => {
          await category.getChildren().then(async (children) => {
            for (child of children) {
              const argument = child.name;
              const result = await recursive(argument);
              productsToReturn.push(result);
            }
          });
        })
        .catch((e) => {
          console.log(e);
          res.status(400).send(e.message);
        });
    }

    await recursive(name);

    if (order === "nameASC") {
      return res.json(
        result.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (b.name < a.name) return 1;
          return 0;
        })
      );
    }

    if (order === "nameDESC") {
      return res.json(
        result.sort((a, b) => {
          if (a.name > b.name) return -1;
          if (b.name > a.name) return 1;
          return 0;
        })
      );
    }

    if (order === "priceASC") {
      return res.json(
        result.sort((a, b) => {
          if (a.price < b.price) return -1;
          if (b.price < a.price) return 1;
          return 0;
        })
      );
    }

    if (order === "priceDESC") {
      return res.json(
        result.sort((a, b) => {
          if (a.price > b.price) return -1;
          if (b.price > a.price) return 1;
          return 0;
        })
      );
    }
    if (order === "oldest") {
      return res.json(
        result.sort((a, b) => {
          if (a.added < b.added) return -1;
          if (b.added < a.added) return 1;
          return 0;
        })
      );
    }

    if (order === "newest") {
      return res.json(
        result.sort((a, b) => {
          if (a.added > b.added) return -1;
          if (b.added > a.added) return 1;
          return 0;
        })
      );
    }

    if (order === "ratingASC") {
      return res.json(
        result.sort((a, b) => {
          if (a.rating < b.rating) return -1;
          if (b.rating < a.rating) return 1;
          return 0;
        })
      );
    }

    if (order === "ratingDESC") {
      return res.json(
        result.sort((a, b) => {
          if (a.rating > b.rating) return -1;
          if (b.rating > a.rating) return 1;
          return 0;
        })
      );
    }

    return res.json(result);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
