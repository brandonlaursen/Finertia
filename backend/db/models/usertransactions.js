"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserTransactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserTransactions.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  UserTransactions.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      amount: DataTypes.INTEGER,
      transactionType: { type: DataTypes.STRING, allowNull: false },
      transactionDate: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "UserTransactions",
    }
  );
  return UserTransactions;
};
