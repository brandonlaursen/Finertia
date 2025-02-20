"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StockListJoin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StockListJoin.init(
    {
      stockId: { type: DataTypes.INTEGER, allowNull: false },
      stockListId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "StockListJoin",
    }
  );
  return StockListJoin;
};
