const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "products_relations",
    {
      product_1_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_2_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    { timestamps: false }
  );
};
