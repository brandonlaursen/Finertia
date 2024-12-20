"use strict";
const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.UserTransaction, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });

      User.hasMany(models.StockList, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });

      User.belongsToMany(models.Stock, {
        through: models.StockUserTransaction,
        foreignKey: "userId",
        otherKey: "stockId",
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: [
            "hashedPassword",
            "email",
            "createdAt",
            "updatedAt",
            "balance",
          ],
        },
      },
    }
  );
  return User;
};
