"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPortfolioSnapshot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserPortfolioSnapshot.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  UserPortfolioSnapshot.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      timestamp: { type: DataTypes.INTEGER, allowNull: false },
      portfolioValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
      sequelize,
      modelName: "UserPortfolioSnapshot",
    }
  );
  return UserPortfolioSnapshot;
};
