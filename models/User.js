const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
sequelize.define('user', {
        user_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false,
            // unique : true
        },
        address : {
            type : DataTypes.STRING,
            // allowNull : false,
        },
        rating_as_buyer : {
            type : DataTypes.FLOAT,
        },
        rating_as_seller : {
            type : DataTypes.FLOAT,
        },
        active : {
            type : DataTypes.BOOLEAN,
            defaultValue : false,
        },
        admin : {
            type : DataTypes.BOOLEAN,
            defaultValue : false,
        },
        provider : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        newsletter : {
            type : DataTypes.BOOLEAN,
            defaultValue : false,
        }
    }, { timestamps : true });
}