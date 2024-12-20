"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StockList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StockList.belongsTo(models.User, {
        foreignKey: "userId",
      });



      StockList.belongsToMany(models.Stock, {
        through: models.StockListJoin,
        foreignKey: "stockListId",
        otherKey: "stockId",
      });
    }
  }
  StockList.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: DataTypes.STRING,
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "StockList",
    }
  );
  return StockList;
};
