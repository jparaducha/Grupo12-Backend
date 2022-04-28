const router = require("express").Router();
const { Product, Category } = require("../db");

router.post("/", async (req, res) => {
  const { parent_name, name } = req.body;
  let parent;
  let category = await Category.findOne({
    where: {
      name: name,
    },
  });
  if (category) {
    return res.status(400).json("Category already exists");
  }

  if (parent_name) {
    parent = await Category.findOne({
      where: {
        name: parent_name,
      },
    });
    if (!parent) {
      return res.status(400).json("Parent category not found");
    }
  }

  if (Array.isArray(name) && parent) {
    name.forEach(async (i) => {
      const newCategory = await Category.create({
        name: i,
      })
        .then((data) => {
          return data;
        })
        .catch((e) => {
          console.log(e);
          return res.status(400).send(e.message);
        });

      await parent
        .addChildren(newCategory)
        .then((data) => {
          // console.log(data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(400).send(e.message);
        });
    });

    return res.json("Multiple categories created");
  }
  const newCategory = await Category.create({
    name,
  })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e.message);
    });
  if (parent) {
    await parent
      .addChildren(newCategory)
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).send(e.message);
      });
  }
  res.send(newCategory);
});

router.get("/", async (req, res) => {
  const { name } = req.query;

  if (name) {
    Category.findOne({
      where: { name: name },
    })
      .then((category) => {
        return res.status(200).send(category);
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send(error.message);
      });
  }

  const categories = await Category.findAll()
    .then((categories) => {
      return categories;
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).send(error.message);
    });

  if(!categories.length) return res.json("No categories found").status(204);

  return res.json(categories);
});


module.exports = router;
// const categories = await Category.findAll({
//     where : {
//         parent_name : null
//     },
//     include : {
//         model : Category,
//         as : 'children',
//         attributes : ['name']
//     },
//     attributes : ['name']
// })