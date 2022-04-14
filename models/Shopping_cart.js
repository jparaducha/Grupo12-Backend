const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('shopping_cart',{
        id: {
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
        product : {
            type : DataTypes.JSON,
        }
    }, { timestamps : false })
}