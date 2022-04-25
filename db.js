const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DATABASE_URL } = process.env;

const sequelize = new Sequelize(DATABASE_URL, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false,
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  User,
  Reset,
  Product,
  Shopping_cart,
  Stock,
  Category,
  Signup,
  Wishlist,
  Movement,
  Products_relations,
  Recently_searched,
} = sequelize.models;

User.hasMany(Shopping_cart, { foreignKey: "buyer_id" });
Shopping_cart.belongsTo(User, { foreignKey: "buyer_id" });
User.belongsToMany(Product, {
  through: Stock,
  as: "stocks",
  foreignKey: "user_id",
});
Product.belongsToMany(User, {
  through: Stock,
  as: "sellers",
  foreignKey: "product_id",
});
User.hasOne(Product, {
  through: Movement,
  foreignKey: "buyer_id",
  as: "buyers",
});
User.belongsToMany(Product, {
  through: Wishlist,
  as: "wishlists",
  foreignKey: "user_id",
});
Product.belongsToMany(User, {
  through: Wishlist,
  as: "userW",
  foreignKey: "product_id",
});
Category.hasMany(Category, { as: "children", foreignKey: "parent_name" });
Product.belongsTo(Category, { as: "categories" ,targetKey: "name", foreignKey: "category_name" });
// User.belongsToMany(Product, { through : Movement, foreignKey : "seller_id", as : "sellers"});
// Movement.hasOne(Product);
Product.belongsToMany(User, { through: Movement });
//Product.belongsToMany(Product, { through: "Product_relations", as: "relations", foreignKey: "other_product_id",});
// Movement.hasOne(User, { foreignKey : "seller_id"});
// User.belongsTo(Movement);
// Category.hasMany(Product,  {foreignKey : 'category_id'})

sequelize
  .sync({ force: true })
  .then((data) => {
    console.log("DB synced");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  sequelize,
  User,
  Reset,
  Product,
  Shopping_cart,
  Stock,
  Category,
  Signup,
  Movement,
  Wishlist,
  Products_relations,
  Recently_searched,
};
