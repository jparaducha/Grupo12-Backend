const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('shopping_cart',{
        buyer_id: {
            type : DataTypes.UUID,
            primaryKey : true,
        },
        seller_id: {
            type : DataTypes.UUID,
            primaryKey : true
        },
        quantity : {
            type : DataTypes.INTEGER,
        },
        unit_price : {
            type : DataTypes.FLOAT,
        },
        product_id : {
            type : DataTypes.UUID,
            primaryKey : true
        },
        product : {
            type : DataTypes.JSON,
        }
    }, { timestamps : false })
}