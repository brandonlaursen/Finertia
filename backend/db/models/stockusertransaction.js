"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StockUserTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StockUserTransaction.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      stockId: { type: DataTypes.INTEGER, allowNull: false },
      transactionType: { type: DataTypes.STRING, allowNull: false },
      quantity: { type: DataTypes.DECIMAL(10,2), allowNull: false },
      purchasePrice: { type: DataTypes.DECIMAL(10,2), allowNull: false },
      purchaseDate: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "StockUserTransaction",
    }
  );
  return StockUserTransaction;
};
