const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("movement", {
        order_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        seller : {
            type : DataTypes.STRING
        },
        buyer_id : {
            type : DataTypes.STRING
        },
        product : {
            type : DataTypes.JSON
        },
        input : {
            type : DataTypes.DATEONLY,
            defaultValue : new Date()
        },
        output : {
            type : DataTypes.STRING
        },
        type : {
            type : DataTypes.STRING
        },
        notes : {
            type : DataTypes.TEXT
        },
        productImg : {
            type : DataTypes.STRING
        },
        seen : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        rated : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        product_id : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        rating : {
            type : DataTypes.FLOAT
        }
    },{ timestamps : false});
    }
