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
        seller_name : {
            type : DataTypes.STRING
        },
        seller_email : {
            type : DataTypes.STRING
        },
        buyer_id : {
            type : DataTypes.STRING
        },
        buyer_name : {
            type : DataTypes.STRING
        },
        buyer_email : {
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
            type : DataTypes.STRING(DataTypes.ENUM([
                "SALE",
                "SENT",
                "RECEIVED"
            ]))
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
        },
        quantity : {
            type : DataTypes.INTEGER
        },
        unit_price : {
            type : DataTypes.FLOAT
        }
    },{ timestamps : false});
    }
