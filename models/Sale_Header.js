const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("sale_header", {
        buyer_id : {
            type : DataTypes.STRING
        },
        seller_id: {
            type : DataTypes.JSON
        },
        order_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        product : {
            type : DataTypes.JSON
        },
        order_date :  {
            type: "TIMESTAMP",
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
            allowNull: false,
          },
        status: {
            type : DataTypes.STRING
        },
        delivery_date : {
            type : DataTypes.DATE
        },
        email: {
            type : DataTypes.STRING
        },
        address: {
            type : DataTypes.STRING
        },
    })
}