"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "StockListJoins",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        stockId: {
          type: Sequelize.INTEGER,
          references: { model: "Stocks" },
          onDelete: "CASCADE",
          allowNull: false,
        },
        stockListId: {
          type: Sequelize.INTEGER,
          references: { model: "StockLists" },
          onDelete: "CASCADE",
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
    options.tableName = "StockListJoins";
    return queryInterface.dropTable(options);
  },
};
