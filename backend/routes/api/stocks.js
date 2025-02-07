const express = require("express");
const router = express.Router();
const { Stock, StockList } = require("../../db/models");
const { Op } = require("sequelize");
const finnhub = require("finnhub");
const symbols = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "META",
  "NVDA",
  "BRK.B",
  "JNJ",
  "V",
  "WMT",
  "DIS",
  "PYPL",
  "HD",
  "INTC",
  "XOM",
  "UNH",
  "PFE",
  "CSCO",
  "NFLX",
  "GOOG",
  "BABA",
  "BA",
  "CRM",
  "MA",
  "CAT",
  "VZ",
  "KO",
  "MCD",
  "IBM",
  "GE",
  "AMT",
  "T",
  "LMT",
  "GS",
  "SPGI",
  "MS",
  "AXP",
  "BRK.A",
  "TSM",
  "WFC",
  "P&G",
  "SLB",
  "NKE",
  "LILAK",
  "TGT",
  "AMD",
  "SBUX",
  "CVX",
  "DUK",
  "EL",
  "CSX",
  "ADBE",
  "AIG",
  "MCO",
  "ZTS",
  "ABT",
  "BMY",
  "C",
  "UPS",
  "TROW",
  "COST",
  "MSCI",
  "AMGN",
  "LUV",
  "EXC",
  "DHR",
  "MDT",
  "ISRG",
  "AON",
  "BAX",
  "TMUS",
  "WDC",
  "RSG",
  "INTU",
  "CLX",
  "VLO",
  "STT",
  "NUE",
  "KMB",
  "HUM",
  "CNC",
  "BIIB",
  "VRTX",
  "CTSH",
  "FIS",
  "PGR",
  "COP",
  "NEM",
  "AFL",
  "CTAS",
  "MET",
  "OXY",
  "F",
  "TAP",
  "VTR",
  "WBA",
];

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

  const oneDay = getDate(0);
  const oneWeek = getDate(7);
  const oneMonth = getDate(30);
  const threeMonth = getDate(90);
  const oneYear = getDate(365);
  const fiveYear = getDate(1825);

  try {
    const stock = await Stock.findOne({
      where: {
        stockSymbol,
      },
      include: [StockList],
    });

    const todaysDate = getDate();

    const [
      oneDayAggregatesJSON,
      oneWeekAggregatesJSON,
      oneMonthAggregatesJSON,
      threeMonthAggregatesJSON,
      oneYearAggregatesJSON,
      fiveYearAggregatesJSON,
    ] = await Promise.all([
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/5/minute/${oneDay}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${oneWeek}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${oneMonth}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/day/${threeMonth}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/month/${oneYear}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/month/${fiveYear}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
    ]);

    let [
      oneDayAggregates,
      oneWeekAggregates,
      oneMonthAggregates,
      threeMonthAggregates,
      oneYearAggregates,
      fiveYearAggregates,
    ] = await Promise.all([
      oneDayAggregatesJSON.json(),
      oneWeekAggregatesJSON.json(),
      oneMonthAggregatesJSON.json(),
      threeMonthAggregatesJSON.json(),
      oneYearAggregatesJSON.json(),
      fiveYearAggregatesJSON.json(),
    ]);

    if (oneDayAggregates.status === "DELAYED") {
      const yesterdayDay = getDate(1);
      const yesterdaysAggregatesJSON = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/5/minute/${yesterdayDay}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      );

      const yesterdaysAggregates = await yesterdaysAggregatesJSON.json();

      oneDayAggregates = yesterdaysAggregates;
    }

    const [stockDetailsJSON, stockSnapshotJSON, stockNewsJSON] =
      await Promise.all([
        fetch(
          `https://api.polygon.io/v3/reference/tickers/${stockSymbol}?apiKey=${process.env.STOCK_API_KEY2}`
        ),
        fetch(
          `https://api.polygon.io/v3/snapshot?ticker.any_of=${stockSymbol}&limit=10&apiKey=${process.env.STOCK_API_KEY2}`
        ),
        fetch(
          `https://api.polygon.io/v2/reference/news?ticker=${stockSymbol}&limit=10&apiKey=${process.env.STOCK_API_KEY2}`
        ),
      ]);

    const [stockDetails, stockSnapshot, stockNews] = await Promise.all([
      stockDetailsJSON.json(),
      stockSnapshotJSON.json(),
      stockNewsJSON.json(),
    ]);

    const {
      id = null,
      stockName: name = "-",
      stockSymbol: symbol = "-",
    } = stock ?? {};

    const {
      market_cap = 0,
      address: { city = "-", state = "-" } = {},
      description = "-",
      total_employees: employees = 0,
      sic_description: industry = "-",
    } = stockDetails?.results ?? {};

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
    } = stockSnapshot.results[0] ?? {};

    const stockData = {
      id,
      name,
      symbol,
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
      description,
      employees,
      industry,
      headquarters: `${city},${state}`,
      market_cap,
      high,
      low,
      open,
      close,
      volume,
      news: stockNews?.results ?? [],
      listIds: stock.StockLists.map((stock) => stock.id),
      oneDayAggregates: oneDayAggregates.results,
      oneWeekAggregates: oneWeekAggregates.results,
      oneMonthAggregates: oneMonthAggregates.results,
      threeMonthAggregates: threeMonthAggregates.results,
      oneYearAggregates: oneYearAggregates.results,
      fiveYearAggregates: fiveYearAggregates.results,
    };

    return res.json(stockData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Failed to fetch stock data" });
  }
});

// * Get all stocks
router.get("/", async (req, res) => {
  // const stocks = await Stock.findAll();

  const url =
    "https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=AAPL%2CMSFT%2C%5ESPX%2C%5ENYA%2CGAZP.ME%2CSIBN.ME%2CGEECEE.NS";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.STOCK_API_KEY3,
        "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com",
      },
    });
    const stocks = await response.json();

    return res.json(stocks);
  } catch (error) {
    res.status(500).json({ error, message: "Failed to fetch stock data" });
  }
});

module.exports = router;
