"use strict";

const { UserTransaction } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
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
          amount: 200,
          transactionType: "withdrawal",
          transactionDate: new Date(),
        },
        {
          userId: 1,
          amount: 150,
          transactionType: "deposit",
          transactionDate: new Date(),
        },

        {
          userId: 2,
          amount: 300,
          transactionType: "withdrawal",
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
          transactionType: "withdrawal",
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
          transactionType: "withdrawal",
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
    const { Op } = Sequelize;
    return queryInterface.bulkDelete("UserTransaction", {
      userId: { [Op.in]: [1, 2, 3] },
    });
  },
};
