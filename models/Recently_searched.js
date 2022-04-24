const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("category", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    products: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
  });
};
