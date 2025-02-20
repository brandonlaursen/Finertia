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

      Stock.hasMany(models.StockPriceTimestamp, { foreignKey: "stockId" });

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
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      totalEmployees: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      marketCap: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Stock",
    }
  );
  return Stock;
};
