const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "product",
    {
      product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
      },
      rating: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),

        set(value) {
          const rawValue = this.getDataValue("rating");

          if (!rawValue) return this.setDataValue("rating", [value]);

          return this.setDataValue("rating", [...rawValue, value]);
        },

        get() {
          const rawValue = this.getDataValue("rating");
          if (!rawValue || !rawValue.length) return null;
          const average = rawValue.reduce((acc, curr) => {
            return acc + curr;
          }, 0);

          return average / rawValue.length;
        },
      },
      amount_sold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.FLOAT,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      added: {
        type: DataTypes.DATE,
      },
      featured_seller: {
        type: DataTypes.JSON,
      },
    },
    { timestamps: false }
  );
};
