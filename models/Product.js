const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
sequelize.define('product', {
        product_id : {
            type : DataTypes.UUID,
            defaultValue : DataTypes.UUIDV4,
            primaryKey : true,
        },
        product_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        approved : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : false
        },
        description : {
            type : DataTypes.TEXT,
            allowNull : false,
        },
        stock : {
            type : DataTypes.NUMBER,
            allowNull : false,
        },
        rating : {
            type : DataTypes.FLOAT,
        },
        amount_selled : {
            type : DataTypes.NUMBER,
            allowNull : false,
        }
    });
}