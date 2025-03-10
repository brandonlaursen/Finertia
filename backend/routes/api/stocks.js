const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const { Stock, StockList, StockPriceTimestamp } = require("../../db/models");
const { getDate } = require("./helpers/getDate.js");

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

const updateDatabaseMiddleware = async (req, res, next) => {
  try {
    const { stockSymbol } = req.params;

    const stock = await Stock.findOne({
      where: { stockSymbol },
    });

    if (!stock) {
      return res.status(500).json({ message: "Stock not found" });
    }

    const latestRecord = await StockPriceTimestamp.findOne({
      where: { stockId: stock.id },
      order: [["timestamp", "DESC"]],
    });

    const latestDateUnix = latestRecord
      ? new Date(latestRecord.timestamp).getTime()
      : 0;

    const nowUnix = Date.now();
    const apiKey = process.env.STOCK_API_KEY2;

    const [oneHourDataObj, oneDayDataObj] = await Promise.all([
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${latestDateUnix}/${nowUnix}?adjusted=true&sort=asc&apiKey=${apiKey}`
      ).then((res) => res.json()),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/day/${latestDateUnix}/${nowUnix}?adjusted=true&sort=asc&apiKey=${apiKey}`
      ).then((res) => res.json()),
    ]);

    const oneHourData = (oneHourDataObj.results || []).map((agg) => ({
      stockId: stock.id,
      timestamp: agg.t,
      price: agg.c,
      interval: "1H",
    }));

    const oneDayData = (oneDayDataObj.results || []).map((agg) => ({
      stockId: stock.id,
      timestamp: agg.t,
      price: agg.c,
      interval: "1D",
    }));

    await Promise.all([
      StockPriceTimestamp.bulkCreate(oneHourData, {
        updateOnDuplicate: ["price"],
      }),
      StockPriceTimestamp.bulkCreate(oneDayData, {
        updateOnDuplicate: ["price"],
      }),
    ]);

    req.stock = stock;
    next();
  } catch (error) {
    console.error("Error updating database:", error);
    next(error);
  }
};

const checkMarketStatus = async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.polygon.io/v1/marketstatus/now?apiKey=${process.env.STOCK_API_KEY2}`
    );

    const marketStatus = await response.json();
    console.log("===>", marketStatus.market);
    if (marketStatus.market === "open") {
      next();
    } else {
      return res.json({ message: "Market Closed", marketStatus: "closed" });
    }
  } catch (error) {
    console.error("Error updating database:", error);
    next(error);
  }
};

router.get(
  "/:stockSymbol",
  checkMarketStatus,
  updateDatabaseMiddleware,
  async (req, res) => {
    const { stockSymbol } = req.params;

    const stock = await Stock.findOne({
      where: { stockSymbol },
      include: [StockList, StockPriceTimestamp],
    });

    if (!stock) {
      return res.status(500).json({ message: "Stock not found" });
    }

    try {
      const currentTime = Date.now();
      const todaysDate = getDate();
      const oneDayAway = getDate(1);
      const oneWeekAway = getDate(7);

      const [stockSnapshotResponse, stockNewsResponse] = await Promise.all([
        fetch(
          `https://api.polygon.io/v3/snapshot?ticker.any_of=${stockSymbol}&limit=10&apiKey=${process.env.STOCK_API_KEY2}`
        ),
        fetch(
          `https://api.polygon.io/v2/reference/news?ticker=${stockSymbol}&limit=10&apiKey=${process.env.STOCK_API_KEY2}`
        ),
      ]);

      const [stockSnapshotData, stockNewsData] = await Promise.all([
        stockSnapshotResponse.json(),
        stockNewsResponse.json(),
      ]);

      const {
        market_status = "-",
        session: {
          price = 0,
          change = 0,
          change_percent = 0,
          regular_trading_change = 0,
          regular_trading_change_percent = 0,
          early_trading_change = 0,
          early_trading_change_percent = 0,
          late_trading_change = 0,
          late_trading_change_percent = 0,
          high = 0,
          low = 0,
          open = 0,
          close = 0,
          volume = 0,
        } = {},
      } = stockSnapshotData.results[0] ?? {};

      const stockNews = stockNewsData?.results ?? [];

      const [oneMonthData, fiveYearsData] = await Promise.all([
        StockPriceTimestamp.findAll({
          where: {
            stockId: stock.id,
            interval: "1H",
          },
          order: [["timestamp", "ASC"]],
        }),

        StockPriceTimestamp.findAll({
          where: {
            stockId: stock.id,
            interval: "1D",
          },
          order: [["timestamp", "ASC"]],
        }),
      ]);

      const [oneDayDataResponse, oneWeekDataResponse] = await Promise.all([
        fetch(
          `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/5/minute/${oneDayAway}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
        ),
        fetch(
          `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${oneWeekAway}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
        ),
      ]);

      let [oneDayData, oneWeekData] = await Promise.all([
        oneDayDataResponse.json(),
        oneWeekDataResponse.json(),
      ]);

      if (oneDayData.resultsCount === 0) {
        oneDayData = oneWeekData;
      }

      const oneDayAggregates = oneDayData.results.map((aggregate) => ({
        x: aggregate.t,
        y: aggregate.c,
      }));

      const oneWeekAggregates = oneWeekData.results.map((aggregate) => ({
        x: aggregate.t,
        y: aggregate.c,
      }));

      const oneMonthAggregates = oneMonthData.map((aggregate) => {
        const newDate = new Date(aggregate.timestamp);
        const unixTimestamp = newDate.getTime();
        return {
          x: unixTimestamp,
          y: aggregate.price,
        };
      });

      const threeMonthsAggregates = fiveYearsData
        .filter((aggregate) => {
          const newDate = new Date(aggregate.timestamp);
          const unixTimestamp = newDate.getTime();
          return currentTime - unixTimestamp <= 3 * 30 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
        })
        .map((aggregate) => {
          const newDate = new Date(aggregate.timestamp);
          const unixTimestamp = newDate.getTime();
          return {
            x: unixTimestamp,
            y: aggregate.price,
          };
        });

      const oneYearAggregates = fiveYearsData
        .filter((aggregate) => {
          const newDate = new Date(aggregate.timestamp);
          const unixTimestamp = newDate.getTime();
          return currentTime - unixTimestamp <= 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds
        })
        .map((aggregate) => {
          const newDate = new Date(aggregate.timestamp);
          const unixTimestamp = newDate.getTime();
          return {
            x: unixTimestamp,
            y: aggregate.price,
          };
        });

      const fiveYearsAggregates = fiveYearsData.map((aggregate) => {
        const newDate = new Date(aggregate.timestamp);
        const unixTimestamp = newDate.getTime();
        return {
          x: unixTimestamp,
          y: aggregate.price,
        };
      });

      const stockData = {
        id: stock.id,
        name: stock.stockName,
        symbol: stock.stockSymbol,
        address: stock.address,
        description: stock.description,
        totalEmployees: stock.totalEmployees,
        marketCap: stock.marketCap,
        industry: stock.industry,
        listIds: stock.StockLists.map((stock) => stock.id),
        price,
        change,
        change_percent,
        market_status,
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
        news: stockNews,
        oneDayAggregates,
        oneWeekAggregates,
        oneMonthAggregates,
        threeMonthsAggregates,
        oneYearAggregates,
        fiveYearsAggregates,
      };

      return res.json(stockData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, message: "Failed to fetch stock data" });
    }
  }
);

router.get("/lists/:stockSymbol", checkMarketStatus, async (req, res) => {
  const { stockSymbol } = req.params;


  try {
    const todaysDate = getDate();
    const oneDayAway = getDate(1);

    const oneDayDataResponse = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/5/minute/${oneDayAway}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
    );

    const oneDayData = await oneDayDataResponse.json();


    const oneDayAggregates = oneDayData.results.map((aggregate) => ({
      x: aggregate.t,
      y: aggregate.c,
    }));
  
    return res.json({ stockSymbol, oneDayAggregates });
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
