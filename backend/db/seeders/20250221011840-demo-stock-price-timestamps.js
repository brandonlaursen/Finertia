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

    options.tableName = "StockPriceTimestamps";
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
      let currentUrl = `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/day/${fiveYearsAgo}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`;

      const timestamps = [];

      while (currentUrl) {
        const response = await fetch(currentUrl);
        const data = await response.json();
        if (!data.results) {
          currentUrl = null;
          continue;
        }

        for (let aggregateBar of data.results) {
          timestamps.push({
            stockId,
            timestamp: aggregateBar.t,
            price: aggregateBar.c,
            interval: "1D",
          });
        }

        if (data.next_url) {
          currentUrl = data.next_url + `&apiKey=${process.env.STOCK_API_KEY2}`;
        } else {
          currentUrl = null;
        }
      }

      return timestamps;
    }

    async function getOneHourIntervalsUpToOneMonth(stockSymbol, stockId) {
      const oneMonthAgo = getDate(30);
      let currentUrl = `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${oneMonthAgo}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`;

      const timestamps = [];

      while (currentUrl) {
        const response = await fetch(currentUrl);
        const data = await response.json();
        if (!data.results) {
          currentUrl = null;
          continue;
        }

        for (let aggregateBar of data.results) {
          timestamps.push({
            stockId,
            timestamp: aggregateBar.t,
            price: aggregateBar.c,
            interval: "1H",
          });
        }
        if (data.next_url) {
          currentUrl = data.next_url + `&apiKey=${process.env.STOCK_API_KEY2}`;
        } else {
          currentUrl = null;
        }
      }

      return timestamps;
    }

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
    return queryInterface.dropTable(options);
  },
};
