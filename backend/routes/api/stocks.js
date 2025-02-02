const express = require("express");
const router = express.Router();
const { Stock } = require("../../db/models");
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
          return reject(error); // Handle errors
        }
        resolve(data); // Resolve with data
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
          return reject(error); // Handle errors
        }
        resolve(data); // Resolve with data
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

  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = process.env.STOCK_API_KEY;
  const finnhubClient = new finnhub.DefaultApi();

  const fetchStockNews = async () => {
    return new Promise((resolve, reject) => {
      finnhubClient.companyNews(
        stockSymbol,
        "2025-01-01",
        "2025-01-28",
        (error, data, response) => {
          if (error) {
            return reject(error); // Handle errors
          }
          resolve(data); // Resolve with data
        }
      );
    });
  };

  try {
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.STOCK_API_KEY3,
        "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com",
      },
    };

    const historicalDataJSON = await fetch(
      `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history?symbol=${stockSymbol}&interval=5m&diffandsplits=false`,
      options
    );

    const historicalData = await historicalDataJSON.json();

    const stockProfileJSON = await fetch(
      `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules?ticker=${stockSymbol}&module=asset-profile`,
      options
    );
    const stockProfile = await stockProfileJSON.json();

    const stockTickersJSON = await fetch(
      `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/quote?ticker=${stockSymbol}&type=STOCKS`,
      options
    );

    const stockTickers = await stockTickersJSON.json();

    const companyNews = await fetchStockNews();

    return res.json({
      stockTickers,
      stockProfile,
      historicalData,
      // historicalData2,
      companyNews,
      message: "successfully retrieved stock info",
    });
  } catch (error) {
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
    const result = await response.json();

    return res.json({
      result,
      message: "successfully retrieved all stocks",
    });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to fetch stock data" });
  }
});

module.exports = router;
