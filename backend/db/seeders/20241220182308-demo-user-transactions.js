"use strict";

const { UserTransaction } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await UserTransaction.bulkCreate(
      [
        {
          userId: 1,
          amount: 500,
          transactionType: "deposit",
          transactionDate: new Date(),
        },
        {
          userId: 1,
          amount: 20,
          transactionType: "withdrawal",
          transactionDate: new Date(),
        },
        {
          userId: 1,
          amount: 100,
          transactionType: "deposit",
          transactionDate: new Date(),
        },

        {
          userId: 2,
          amount: 3000,
          transactionType: "deposit",
          transactionDate: new Date(),
        },
        {
          userId: 2,
          amount: 150,
          transactionType: "deposit",
          transactionDate: new Date(),
        },
        {
          userId: 2,
          amount: 100,
          transactionType: "withdraw",
          transactionDate: new Date(),
        },
        {
          userId: 3,
          amount: 1000,
          transactionType: "deposit",
          transactionDate: new Date(),
        },
        {
          userId: 3,
          amount: 400,
          transactionType: "withdraw",
          transactionDate: new Date(),
        },
        {
          userId: 3,
          amount: 300,
          transactionType: "deposit",
          transactionDate: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "UserTransactions";
    const { Op } = Sequelize;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] },
    });
  },
};
