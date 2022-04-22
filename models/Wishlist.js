const DataTypes = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('wishlist',{
        product: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        seller_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, { timestamps : false});
};