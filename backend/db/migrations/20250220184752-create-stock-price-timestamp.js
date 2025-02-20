'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StockPriceTimestamps", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      stockId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Stocks" },
        onDelete: "CASCADE",
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL,
        type: Sequelize.DECIMAL(10, 2),
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
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "StockPriceTimestamps";
    await queryInterface.dropTable("StockPriceTimestamps",options);
  },
};
