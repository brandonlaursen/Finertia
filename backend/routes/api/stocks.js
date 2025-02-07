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

  function getDate() {
    let date = new Date();

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

  try {
    const stock = await Stock.findOne({
      where: {
        stockSymbol,
      },
      include: [StockList],
    });

    const listIds = stock.StockLists.map((stock) => stock.id);
    const todaysDate = getDate();

    const response1 = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/minute/${todaysDate}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
    );
    const aggregateBars = await response1.json();

    const response2 = await fetch(
      `https://api.polygon.io/v3/reference/tickers/${stockSymbol}?apiKey=${process.env.STOCK_API_KEY2}`
    );
    const stockDetails = await response2.json();

    const stockObj = {
      stockId: stock.id,
      stockDetails,
      aggregateBars,
    };

    return res.json({ stockObj, listIds });
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
