"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "StockUserTransactions",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: { model: "Users" },
          onDelete: "CASCADE",
          allowNull: false,
        },
        stockId: {
          type: Sequelize.INTEGER,
          references: { model: "Stocks" },
          onDelete: "CASCADE",
          allowNull: false,
        },
        transactionType: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        quantity: {
          type: Sequelize.DECIMAL(10, 5),
          allowNull: false,
        },
        purchasePrice: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        purchaseDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "StockUserTransactions";
    await queryInterface.dropTable(options);
  },
};
