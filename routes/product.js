const router = require("express").Router();
const { Op, BOOLEAN } = require("sequelize");
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
    const { product_id, order, stock } = req.query;

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
          if (!product) {
            return "Error : product not found";
          } else {
            let hasStock = false;
            let totalStock = 0;
            const result = {
              product_id: product.product_id,
              name: product.name,
              added: product.added,
              approved: product.approved,
              rating: product.rating,
              images: product.images,
              category_name: product.category_name,
              description: product.description,
              sellers: product.sellers,
            };
            if (product.sellers.length !== 0) {
              product.sellers.map((seller) => {
                if (product.featured_seller) {
                  if (product.featured_seller.name == seller.name) {
                    if (seller.stock.quantity == 0) {
                      product.featured_seller = {};
                    }
                  }
                }
              });
              product.sellers.map((seller) => {
                if (seller.stock.quantity != 0) {
                  hasStock = true;
                  if (!product.featured_seller) {
                    product.featured_seller = seller;
                  }
                  if (
                    seller.rating_as_seller >
                    product.featured_seller.rating_as_seller
                  ) {
                    product.featured_seller = seller;
                  }
                  totalStock += seller.stock.quantity;
                } else {
                  if (product.featured_seller.name == seller.name) {
                  }
                }
              });
              product.stock = totalStock;

              if (product.featured_seller !== undefined) {
                const final_featured_seller_stock = {
                  quantity: product.featured_seller.stock.quantity,
                  unit_price: product.featured_seller.stock.unit_price,
                };
                product.price = product.featured_seller.stock.unit_price;
                const final_featured_seller = {
                  user_id: product.featured_seller.user_id,
                  name: product.featured_seller.name,
                  rating_as_seller: product.featured_seller.rating_as_seller,
                  stock: final_featured_seller_stock,
                };
                result.featured_seller = final_featured_seller;
                result.stock = totalStock;
                result.price = final_featured_seller.stock.unit_price;
              }
              if (hasStock === false) {
                result.featured_seller = {};
                result.stock = 0;
                result.price = undefined;
              }
            } else {
              result.featured_seller = {};
              result.stock = 0;
              result.price = undefined;
            }
            product.save();
            return result;
          }
        })
        .then((result) => {
          return res.send(result).status(200);
        })
        .catch((e) => {
          console.log(e);
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
        return res.status(204).send("No products found");
      products.forEach(async (product) => {
        let hasStock = false;
        let totalStock = 0;
        const toPush = {
          product_id: product.product_id,
          name: product.name,
          added: product.added,
          approved: product.approved,
          rating: product.rating,
          images: product.images,
          category_name: product.category_name,
          description: product.description,
          sellers: product.sellers,
        };
        if (product.sellers.length !== 0) {
          product.sellers.map((seller) => {
            if (product.featured_seller) {
              if (product.featured_seller.name == seller.name) {
                if (seller.stock.quantity == 0) {
                  product.featured_seller = {};
                }
              }
            }
          });
          product.sellers.map((seller) => {
            if (seller.stock.quantity != 0) {
              hasStock = true;
              if (!product.featured_seller) {
                product.featured_seller = seller;
              }
              if (
                seller.rating_as_seller >
                product.featured_seller.rating_as_seller
              ) {
                product.featured_seller = seller;
              }
              totalStock += seller.stock.quantity;
            }
          });
          product.stock = totalStock;
          if (hasStock === false) {
            toPush.featured_seller = {};
            toPush.stock = 0;
            toPush.price = undefined;
            if (stock == "true") result.push(toPush);
          } else {
            if (product.featured_seller !== undefined) {
              const final_featured_seller_stock = {
                quantity: product.featured_seller.stock.quantity,
                unit_price: product.featured_seller.stock.unit_price,
              };
              product.price = product.featured_seller.stock.unit_price;
              const final_featured_seller = {
                user_id: product.featured_seller.user_id,
                name: product.featured_seller.name,
                rating_as_seller: product.featured_seller.rating_as_seller,
                stock: final_featured_seller_stock,
              };
              toPush.featured_seller = final_featured_seller;
              toPush.stock = totalStock;
              toPush.price = final_featured_seller.stock.unit_price;
              if (hasStock === false) {
                toPush.featured_seller = {};
                toPush.stock = 0;
                toPush.price = undefined;
              }
            }
            result.push(toPush);
          }
        } else {
          toPush.featured_seller = {};
          toPush.stock = 0;
          toPush.price = undefined;
          if (stock == "true") result.push(toPush);
        }
        product.save();
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
      return res.status(204).send("La categoria seleccionada no existe");

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

    const users = await User.findAll();

    json.forEach(async (i) => {
      const product = await Product.create({
        name: i.name,
        description: i.description,
        rating: i.rating,
        images: i.image,
        // "category" : i.category_name,
        added: new Date(Date.now()),
        approved: true,
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
      let firstAdded = false;

      function usersToLoad() {
        let sellersQty = Math.ceil(Math.random() * users.length - 1) + 1;
        let sellersIdx = [];
        let sellerId = Math.ceil(Math.random() * sellersQty);

        for (let i = 0; i < sellersQty; i++) {
          while (sellersIdx.includes(sellerId)) {
            sellerId = Math.ceil(Math.random() * users.length);
          }
          sellersIdx.push(sellerId);
        }

        return sellersIdx;
      }

      let indexes = usersToLoad();
      let newUsers = [];

      for (index of indexes) {
        newUsers.push(users[index]);
      }
      if (newUsers.length === 0) newUsers.push(users[0]);

      for (let user of newUsers) {
        if (!user) continue;
        user
          .addStocks(product, {
            through: {
              quantity: Math.ceil(Math.random() * 100),
              unit_price: !firstAdded
                ? i.price
                : (
                    i.price *
                    (1 + Math.floor(Math.random() * 300) / 1000)
                  ).toFixed(2),
            },
          })
          .then((data) => {
            return data;
          })
          .catch((e) => {
            console.log(e.errors);
          });
        firstAdded = true;
      }

      // console.log(newUsers.filter((i)=> i).map((i)=> i.name));
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

router.patch("/rating", async (req, res) => {
  try {
    const { productId } = req.query;
    const { rating } = req.body;

    if (typeof rating !== "number" || rating > 5 || rating < 0)
      return res.json("Rating must be a number between 0 and 5");

    const product = await Product.findOne({
      where: {
        product_id: productId,
      },
    })
      .then((data) => data)
      .catch(console.log);

    product.rating = rating;

    await product.save();

    return res.json(product);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
