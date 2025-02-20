"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Stocks",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        stockName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        stockSymbol: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        address: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: "-",
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
          defaultValue: "-",
        },
        totalEmployees: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        marketCap: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: '-',
        },
        industry: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: "-",
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Stocks";
    await queryInterface.dropTable(options);
  },
};
