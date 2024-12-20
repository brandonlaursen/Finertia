"use strict";

const { Stock } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Stock.bulkCreate(
      [
        {
          stockName: "Apple Inc.",
          stockSymbol: "AAPL",
          currentPrice: 253,
          marketCap: 3830000000000, 
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          stockName: "Microsoft Corp.",
          stockSymbol: "MSFT",
          currentPrice: 320,
          marketCap: 2400000000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          stockName: "Amazon.com Inc.",
          stockSymbol: "AMZN",
          currentPrice: 140,
          marketCap: 1460000000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          stockName: "Alphabet Inc. Class A",
          stockSymbol: "GOOGL",
          currentPrice: 135,
          marketCap: 1900000000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          stockName: "Tesla Inc.",
          stockSymbol: "TSLA",
          currentPrice: 630,
          marketCap: 740000000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          stockName: "Meta Platforms Inc.",
          stockSymbol: "META",
          currentPrice: 320,
          marketCap: 890000000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          stockName: "NVIDIA Corp.",
          stockSymbol: "NVDA",
          currentPrice: 480,
          marketCap: 1200000000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          stockName: "Johnson & Johnson",
          stockSymbol: "JNJ",
          currentPrice: 160,
          marketCap: 420000000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          stockName: "JPMorgan Chase & Co.",
          stockSymbol: "JPM",
          currentPrice: 145,
          marketCap: 460000000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          stockName: "Exxon Mobil Corp.",
          stockSymbol: "XOM",
          currentPrice: 110,
          marketCap: 440000000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Stocks";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        stockName: {
          [Op.in]: [
            "Apple Inc.",
            "Microsoft Corp.",
            "Amazon.com Inc.",
            "Alphabet Inc. Class A",
            "Tesla Inc.",
            "Meta Platforms Inc.",
            "NVIDIA Corp.",
            "Johnson & Johnson",
            "JPMorgan Chase & Co.",
            "Exxon Mobil Corp.",
          ],
        },
      },
      {}
    );
  },
};
