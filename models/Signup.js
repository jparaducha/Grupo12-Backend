const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
sequelize.define('signup', {
        token : {
            type : DataTypes.STRING,
            allowNull : false,
            primaryKey : true
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false
        }
    }, { timestamps : false });
};