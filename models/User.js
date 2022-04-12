const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
sequelize.define('user', {
        user_id : {
            type : DataTypes.UUID,
            defaultValue : DataTypes.UUIDV4,
            primaryKey : true,
        },
        user_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        user_password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        user_email : {
            type : DataTypes.STRING,
            allowNull : false,
            // unique : true
        }
    }, { timestamps : false });
}