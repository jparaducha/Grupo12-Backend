const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

require("dotenv").config();

const { 
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE
} = process.env

// const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
//     host : DB_HOST,
//     port : DB_PORT,
//     dialect : "postgres"
// })

const sequelize = new Sequelize("ecommerce", "admin", "admin", {
    host : "localhost",
    port : 5432,
    dialect : "postgres",
    logging : false
})

const User = sequelize.define('user', {
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



const Reset = sequelize.define("reset", {
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


sequelize.sync( {alter: true} ).then((data)=>{
    console.log("DB synced");
})
.catch((err)=>{
    console.log(err);
})

module.exports = {sequelize, User, Reset};