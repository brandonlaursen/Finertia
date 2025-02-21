const express = require("express");
const router = express.Router();
const { Stock, StockList, StockPriceTimestamp } = require("../../db/models");
const { getDate } = require("./helpers/getDate.js");
const { convertToUnix } = require("./helpers/convertToUnix.js");

const finnhub = require("finnhub");

router.get("/news", async (req, res) => {
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = process.env.STOCK_API_KEY;
  const finnhubClient = new finnhub.DefaultApi();

  const fetchMarketNews = async () => {
    return new Promise((resolve, reject) => {
      finnhubClient.marketNews("general", {}, (error, data) => {
        if (error) {
          return reject(error);
        }
        resolve(data);
      });
    });
  };

  try {
    const newsData = await fetchMarketNews();

    res.json(newsData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch market news" });
  }
});

router.get("/news/:category", async (req, res) => {
  const { category } = req.params;

  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = process.env.STOCK_API_KEY;
  const finnhubClient = new finnhub.DefaultApi();

  const fetchMarketNews = async () => {
    return new Promise((resolve, reject) => {
      finnhubClient.marketNews(category, {}, (error, data) => {
        if (error) {
          return reject(error);
        }
        resolve(data);
      });
    });
  };

  try {
    const newsData = await fetchMarketNews();

    res.json(newsData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch market news" });
  }
});

router.get("/:stockSymbol", async (req, res) => {
  const { stockSymbol } = req.params;

  try {
    const stock = await Stock.findOne({
      where: { stockSymbol },
      include: [StockList, StockPriceTimestamp],
    });

    const oneHourIntervals = await StockPriceTimestamp.findAll({
      where: {
        stockId: stock.id,
        interval: "1H",
      },
      order: [["timestamp", "ASC"]],
    });

    const oneDayIntervals = await StockPriceTimestamp.findAll({
      where: {
        stockId: stock.id,
        interval: "1D",
      },
      order: [["timestamp", "ASC"]],
    });

    const latestTimestamp = await StockPriceTimestamp.findOne({
      where: {
        stockId: stock.id,
      },
      order: [["timestamp", "DESC"]],
      limit: 1,
    });

    const todaysDate = getDate();
    console.log(" todaysDate:", todaysDate);
    const oneDay = getDate(1);
    // const oneWeek = getDate(7);

    // * fetch data after latest timestamp stored in db
    // ? could store date in db as unix
    const latestDate = new Date(latestTimestamp.timestamp); // February 20, 2025 at 4:00 AM
    const latestDateInUnix = latestDate.getTime();
    const oneHourLater = latestDateInUnix + 3600000;
    console.log(" oneHourLater:", oneHourLater);
    console.log(" oneHourLater:", oneHourLater);

    console.log(" latestDateInUnix:", latestDateInUnix);

    const [oneDayAggregatesJSON, oneWeekAggregatesJSON] = await Promise.all([
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/5/minute/${oneDay}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${oneHourLater}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
    ]);

    let [oneDayAggregates, oneWeekAggregates] = await Promise.all([
      oneDayAggregatesJSON.json(),
      oneWeekAggregatesJSON.json(),
    ]);

    return res.json({
      // oneHourIntervals,
      //  oneDayIntervals
      oneWeekAggregates,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Failed to fetch stock data" });
  }
});


// * Get all stocks
router.get("/", async (req, res) => {
  try {
    const dbStocks = await Stock.findAll({ include: [StockList] });
    const symbolsString = dbStocks.map((stock) => stock.stockSymbol).join(",");

    const response = await fetch(
      `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${symbolsString}&apiKey=${process.env.STOCK_API_KEY2}`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API request failed with status ${response.status}`,
        message: await response.text(),
      });
    }

    const stocksData = await response.json();
    if (!stocksData.tickers) {
      return res.status(500).json({ message: "API response missing tickers" });
    }

    const mergedStocks = stocksData.tickers.map((apiStock) => {
      const dbStock = dbStocks.find((db) => db.stockSymbol === apiStock.ticker);

      return {
        id: dbStock?.id ?? null,
        symbol: apiStock.ticker,
        name: dbStock?.stockName ?? null,
        current_price: apiStock.day?.c ?? null,
        market_cap: dbStock?.marketCap ?? null,
        todays_change_percent: apiStock.todaysChangePerc ?? null,
        todays_change: apiStock.todaysChange ?? null,
        updated: apiStock.updated ?? null,
        day: apiStock.day ?? null,
        min: apiStock.min ?? null,
        prev_day: apiStock.prevDay ?? null,
        listIds: dbStock.StockLists.map((stock) => stock.id),
      };
    });

    return res.json(mergedStocks);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Failed to fetch stock data" });
  }
});

module.exports = router;
