const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('shopping_cart',{
        buyer_id: {
            type : DataTypes.INTEGER,
            primaryKey : true,
        },
        seller_id: {
            type : DataTypes.INTEGER,
            primaryKey : true
        },
        seller_name : {
            type : DataTypes.STRING,
        },
        quantity : {
            type : DataTypes.INTEGER,
        },
        unit_price : {
            type : DataTypes.FLOAT,
        },
        product_id : {
            type : DataTypes.INTEGER,
            primaryKey : true
        },
        product : {
            type : DataTypes.JSON,
        }
    }, { timestamps : false })
}