const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { APIPORT } = process.env;

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });


app.use("/auth", require("./routes/auth"));

app.use("/dashboard", require("./routes/dashboard"));

app.use("/products", require("./routes/product"));

app.use("/cart", require("./routes/shoppingCart"));

app.use("/stock", require('./routes/stock'));

app.use("/category", require('./routes/category'));

app.use("/admin", require("./routes/admin"));


app.listen( APIPORT , ()=> console.log(`Server running on port ${APIPORT}`));

module.exports = app;