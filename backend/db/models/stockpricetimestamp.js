"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StockPriceTimestamp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StockPriceTimestamp.belongsTo(models.Stock, {
        foreignKey: "stockId",
      });
    }
  }
  StockPriceTimestamp.init(
    {
      stockId: { type: DataTypes.INTEGER, allowNull: false },
      timestamp: { type: DataTypes.DATE, allowNull: false },
      price: { type: DataTypes.DECIMAL, allowNull: false },
      interval: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "StockPriceTimestamp",
    }
  );
  return StockPriceTimestamp;
};
