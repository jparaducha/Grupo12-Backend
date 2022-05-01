const DataTypes = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('stock',{
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue : 1
        },
        unit_price : {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        active : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : true
        }
    });
};