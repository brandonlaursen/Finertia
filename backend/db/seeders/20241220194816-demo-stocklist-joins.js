"use strict";

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { StockListJoin } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await StockListJoin.bulkCreate(
      [
        { stockId: 1, stockListId: 1 }, // Stock 1 in StockList 1
        { stockId: 2, stockListId: 1 }, // Stock 2 in StockList 1
        { stockId: 3, stockListId: 1 }, // Stock 3 in StockList 1

        { stockId: 4, stockListId: 2 }, // Stock 4 in StockList 2
        { stockId: 5, stockListId: 2 }, // Stock 5 in StockList 2
        { stockId: 6, stockListId: 2 }, // Stock 6 in StockList 2

        { stockId: 7, stockListId: 3 }, // Stock 7 in StockList 3
        { stockId: 8, stockListId: 3 }, // Stock 8 in StockList 3
        { stockId: 9, stockListId: 3 }, // Stock 9 in StockList 3
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "StockList";
    const { Op } = Sequelize;
    return queryInterface.bulkDelete(options, {
      stockListId: { [Op.in]: [1, 2, 3] },
    });
  },
};
