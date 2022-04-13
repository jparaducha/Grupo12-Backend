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
            type : DataTypes.INTEGER,
            allowNull : false,
            defaultValue : 1
        },
        rating : {
            type : DataTypes.FLOAT,
        },
        amount_sold : {
            type : DataTypes.INTEGER,
            allowNull : false,
            defaultValue : 0
        },
        images : {
            type : DataTypes.ARRAY(DataTypes.STRING),
        }
    }, { timestamps : false });
}