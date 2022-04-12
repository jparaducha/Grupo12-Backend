const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>{
    sequelize.define("reset", {
    token : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false
    },
    expiry : {
        type : DataTypes.DATE,
        allowNull : false
    }
}, { timestamps : false });
}