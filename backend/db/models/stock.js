"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Stock.belongsToMany(models.User, {
        through: models.StockUserTransaction,
        foreignKey: "stockId",
        otherKey: "userId",
      });

      Stock.hasMany(models.StockUserTransaction, { foreignKey: "stockId" });

      Stock.belongsToMany(models.StockList, {
        through: models.StockListJoin,
        foreignKey: "stockId",
        otherKey: "stockListId",
      });
    }
  }
  Stock.init(
    {
      stockName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      stockSymbol: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      currentPrice: DataTypes.DECIMAL(10, 2),
      marketCap: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "Stock",
    }
  );
  return Stock;
};
