const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('shopping_cart',{
        user_id: {
            type : DataTypes.UUID,
            defaultValue : DataTypes.UUIDV4,
            primaryKey : true,
        },
        quantity : {
            type : DataTypes.INTEGER,
        },
        unit_price : {
            type : DataTypes.FLOAT,
        },
        product_id : {
            type : DataTypes.UUID,
        }
    }, { timestamps : false })
}