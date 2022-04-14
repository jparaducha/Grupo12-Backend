const DataTypes = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('provider_product_stock',{
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit_price : {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });
};