const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("movement", {
        order_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        seller : {
            type : DataTypes.JSON
        },
        buyer_id : {
            type : DataTypes.STRING
        },
        product : {
            type : DataTypes.JSON
        },
        input : {
            type : DataTypes.STRING
        },
        output : {
            type : DataTypes.STRING
        },
        type : {
            type : DataTypes.STRING
        },
        notes : {
            type : DataTypes.TEXT
        }
    },{ timestamps : false});
}