"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('before create')
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
    console.log('after create table')
console.log(options.schema.tableName)
    await queryInterface.addConstraint(
      "StockPriceTimestamps",
      {
        fields: ["stockId", "timestamp", "interval"],
        type: "unique",
        name: "unique_stock_timestamp_interval",
      },
      options
    );

    console.log('after add constraint')
  },
  async down(queryInterface, Sequelize) {
    // options.tableName = "StockPriceTimestamps";

    await queryInterface.removeConstraint(
      { tableName: "StockPriceTimestamps", schema: options.schema },
      "StockPriceTimestamps_stockId_fkey",
      options
    );

    await queryInterface.removeConstraint(
      { tableName: "StockPriceTimestamps", schema: options.schema },
      "unique_stock_timestamp_interval",
      options
    );

    return queryInterface.dropTable({
      tableName: "StockPriceTimestamps",
      schema: options.schema,
    });
  },
};
