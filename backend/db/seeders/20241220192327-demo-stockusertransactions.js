'use strict';


const { StockUserTransaction } = require("../models");

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await StockUserTransaction.bulkCreate(
      [
        {
          userId: 1,
          stockId: 1,
          transactionType: 'buy', // transaction type can be 'buy' or 'sell'
          quantity: 50,
          purchasePrice: 100,
          purchaseDate: new Date('2024-01-01T10:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          stockId: 1,
          transactionType: 'sell',
          quantity: 20,
          purchasePrice: 120,
          purchaseDate: new Date('2024-02-01T12:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          stockId: 2,
          transactionType: 'buy',
          quantity: 100,
          purchasePrice: 50,
          purchaseDate: new Date('2024-03-01T14:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          stockId: 2,
          transactionType: 'buy',
          quantity: 150,
          purchasePrice: 55,
          purchaseDate: new Date('2024-03-10T16:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          stockId: 3,
          transactionType: 'sell',
          quantity: 30,
          purchasePrice: 75,
          purchaseDate: new Date('2024-04-01T18:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          stockId: 3,
          transactionType: 'buy',
          quantity: 20,
          purchasePrice: 80,
          purchaseDate: new Date('2024-04-10T20:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "StockUserTransaction";
    const { Op } = Sequelize;
    return queryInterface.bulkDelete("StockUserTransaction", {
      userId: { [Op.in]: [1, 2, 3] },
    });
  }
};
