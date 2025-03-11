"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "StockPriceTimestamps",
      {
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
          allowNull: false,
        },
        timestamp: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        interval: {
          type: Sequelize.STRING,
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

    console.log("before");
    await queryInterface.addConstraint("StockPriceTimestamps", {
      fields: ["stockId", "timestamp", "interval"],
      type: "unique",
      name: "unique_stock_timestamp_interval",
    });

    console.log("after");
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "StockPriceTimestamps";

    // await queryInterface.removeConstraint(
    //   options,
    //   "StockPriceTimestamps_stockId_fkey"
    // );

    // await queryInterface.removeConstraint(
    //   { tableName: "StockPriceTimestamps", schema: options.schema },
    //   "unique_stock_timestamp_interval",
    //   options
    // );

    await queryInterface.removeConstraint(
      options,
      "unique_stock_timestamp_interval"
    );

    return queryInterface.dropTable(options);
  },
};
