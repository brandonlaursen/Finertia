const express = require("express");
const router = express.Router();

const { Stock, StockList, StockPriceTimestamp } = require("../../db/models");

const checkMarketStatus = require("./helpers/middleware/checkMarketStatus.js");
const updateStockDB = require("./helpers/middleware/updateStockDB.js");

const { getDate } = require("./helpers/getDate.js");
const fetchStockSnapshot = require("./helpers/stocks/fetchStockSnapshot.js");
const {
  fetchOneMonthAndFiveYearsAggregates,
  fetchOneDayAndOneWeekAggregates,
} = require("./helpers/stocks/fetchAggregates.js");
const {
  formatOneDayAggregates,
  formatOneWeekAggregates,
  formatOneMonthAggregates,
  formatThreeMonthsAggregates,
  formatOneYearAggregates,
  formatFiveYearsAggregates,
} = require("./helpers/stocks/formatAggregates.js");

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

// * Get a single stock
router.get(
  "/:stockSymbol",
  checkMarketStatus,
  updateStockDB,
  async (req, res) => {
    const { stockSymbol } = req.params;

    try {
      // * Query stock in DB
      const stock = await Stock.findOne({
        where: { stockSymbol },
        include: [StockList, StockPriceTimestamp],
      });

      if (!stock) {
        return res.status(500).json({ message: "Stock not found" });
      }

      // * Fetch stock snapshot
      const {
        market_status,
        price,
        change,
        change_percent,
        regular_trading_change,
        regular_trading_change_percent,
        early_trading_change,
        early_trading_change_percent,
        late_trading_change,
        late_trading_change_percent,
        high,
        low,
        open,
        close,
        volume,
        stockNews,
      } = await fetchStockSnapshot(stockSymbol);

      // * Fetch aggregates
      const { oneMonthData, fiveYearsData } =
        await fetchOneMonthAndFiveYearsAggregates(stock.id);
      const { oneDayData, oneWeekData } = await fetchOneDayAndOneWeekAggregates(
        stockSymbol
      );

      // * Format aggregate data
      const oneDayAggregates = formatOneDayAggregates(oneDayData);
      const oneWeekAggregates = formatOneWeekAggregates(oneWeekData);
      const oneMonthAggregates = formatOneMonthAggregates(oneMonthData);
      const threeMonthsAggregates = formatThreeMonthsAggregates(fiveYearsData);
      const oneYearAggregates = formatOneYearAggregates(fiveYearsData);
      const fiveYearsAggregates = formatFiveYearsAggregates(fiveYearsData);

      const stockData = {
        id: stock?.id ?? null,
        name: stock?.stockName ?? "N/A",
        symbol: stock?.stockSymbol ?? "N/A",
        address: stock?.address ?? "Unknown",
        description: stock?.description ?? "No description available",
        totalEmployees: stock?.totalEmployees ?? 0,
        marketCap: stock?.marketCap ?? 0,
        industry: stock?.industry ?? "Unknown",
        listIds: stock?.StockLists?.map((stock) => stock?.id) ?? [],

        price: price ?? 0,
        change: change ?? 0,
        change_percent: change_percent ?? 0,
        market_status: market_status ?? "Unknown",

        regular_trading_change: regular_trading_change ?? 0,
        regular_trading_change_percent: regular_trading_change_percent ?? 0,

        early_trading_change: early_trading_change ?? 0,
        early_trading_change_percent: early_trading_change_percent ?? 0,

        late_trading_change: late_trading_change ?? 0,
        late_trading_change_percent: late_trading_change_percent ?? 0,

        high: high ?? 0,
        low: low ?? 0,
        open: open ?? 0,
        close: close ?? 0,
        volume: volume ?? 0,

        news: stockNews ?? [],
        oneDayAggregates: oneDayAggregates ?? [],
        oneWeekAggregates: oneWeekAggregates ?? [],
        oneMonthAggregates: oneMonthAggregates ?? [],
        threeMonthsAggregates: threeMonthsAggregates ?? [],
        oneYearAggregates: oneYearAggregates ?? [],
        fiveYearsAggregates: fiveYearsAggregates ?? [],

        marketStatus: req?.marketStatus ?? "Unknown",
      };

      return res.json(stockData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, message: "Failed to fetch stock data" });
    }
  }
);

// * Get stocks in a list
router.get("/lists/:stockSymbol", checkMarketStatus, async (req, res) => {
  const { stockSymbol } = req.params;

  try {
    const todaysDate = getDate();
    const oneDayAway = getDate(1);
    const oneWeekAway = getDate(7);

    const oneDayDataResponse = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/5/minute/${oneDayAway}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
    );

    let oneDayData = await oneDayDataResponse.json();

    if (oneDayData.resultsCount === 0) {
      const oneWeekDataResponse = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/5/minute/${oneWeekAway}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      );
      const oneWeekData = await oneWeekDataResponse.json();
      oneDayData = oneWeekData;
    }

    const oneDayAggregates = formatOneDayAggregates(oneDayData);

    return res.json({ stockSymbol, oneDayAggregates });
  } catch (error) {
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
