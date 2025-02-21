"use strict";
require("dotenv").config();
const { StockPriceTimestamp, Stock } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // * get timestamp for api call
    function getDate(daysAgo = 0) {
      let date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "America/New_York",
      };

      const dateTimeFormat = new Intl.DateTimeFormat("en-GB", options);
      const [day, month, year] = dateTimeFormat.format(date).split("/");

      return `${year}-${month}-${day}`;
    }

    const stocks = await Stock.findAll();
    const todaysDate = getDate();

    async function getOneDayIntervalsUpToFiveYears(stockSymbol, stockId) {
      const fiveYearsAgo = getDate(1825);

      const timestamps = [];
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/day/${fiveYearsAgo}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      );

      const data = await response.json();
      for (let aggregateBar of data.results) {
        timestamps.push({
          stockId,
          timestamp: aggregateBar.t,
          price: aggregateBar.c,
          interval: "1D",
        });
      }
      return timestamps;
    }

    async function getOneHourIntervalsUpToOneMonth(stockSymbol, stockId) {
      const oneMonthAgo = getDate(30);

      const timestamps = [];
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${oneMonthAgo}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      );

      const data = await response.json();
      for (let aggregateBar of data.results) {
        timestamps.push({
          stockId,
          timestamp: aggregateBar.t,
          price: aggregateBar.c,
          interval: "1H",
        });
      }

      return timestamps;
    }

    // for (let stock of stocks) {
    //   const oneHourIntervals = await getOneHourIntervalsUpToOneMonth(
    //     stock.stockSymbol,
    //     stock.id
    //   );
    //   const oneDayIntervals = await getOneDayIntervalsUpToFiveYears(
    //     stock.stockSymbol,
    //     stock.id
    //   );

    //   const combinedIntervals = [...oneHourIntervals, ...oneDayIntervals];

    //   await StockPriceTimestamp.bulkCreate(combinedIntervals);
    // }

    const fetchIntervals = stocks.map(async (stock) => {
      try {
        const oneHourIntervals = await getOneHourIntervalsUpToOneMonth(
          stock.stockSymbol,
          stock.id
        );

        const oneDayIntervals = await getOneDayIntervalsUpToFiveYears(
          stock.stockSymbol,
          stock.id
        );

        return [...oneHourIntervals, ...oneDayIntervals];
      } catch (error) {
        console.error(
          `Error fetching data for stock ${stock.stockSymbol}:`,
          error.message
        );

        return [];
      }
    });


    const combinedIntervals = await Promise.all(fetchIntervals);

  
    await StockPriceTimestamp.bulkCreate(combinedIntervals.flat());

    // await StockPriceTimestamp.bulkCreate([
    //   {
    //     stockId: 1,
    //     timestamp: 1583384400000,
    //     price: 73.23,
    //     interval: "1D",
    //   },
    // ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "StockPriceTimestamps";
    await queryInterface.dropTable(options);
  },
};
