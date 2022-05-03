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
            type : DataTypes.ARRAY(DataTypes.FLOAT),

            set(value) {
                const rawValue = this.getDataValue('rating_as_seller')
                
                if(!rawValue) return this.setDataValue("rating_as_seller", [value]);
                
                return this.setDataValue("rating_as_seller" , [...rawValue, value])
            },

            get(){
                const rawValue = this.getDataValue("rating_as_seller");

                if(!rawValue) return null;
                
                const average = rawValue.reduce((acc,curr)=>{
                    return acc+curr;
                }, 0);

                return average/rawValue.length;
            }
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
            type : DataTypes.STRING(DataTypes.ENUM([
                "true",
                "false",
                "requested",
                "rejected"
            ])),
            defaultValue : "false"
        },
        newsletter : {
            type : DataTypes.BOOLEAN,
            defaultValue : false,
        }
    }, { timestamps : true });
}