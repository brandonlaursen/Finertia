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
    console.log("call made");
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

// * Get a single stock
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

  const fetchCompanyInfo = async () => {
    return new Promise((resolve, reject) => {
      finnhubClient.companyProfile2(
        { symbol: stockSymbol },
        (error, data, response) => {
          if (error) {
            return reject(error); // Handle errors
          }
          resolve(data); // Resolve with data
        }
      );
    });
  };

  const fetchCompanyFinancials = async () => {
    return new Promise((resolve, reject) => {
      finnhubClient.companyBasicFinancials(
        stockSymbol,
        "all",
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
    const stockQuotesJSON = await fetch(
      `https://api.marketdata.app/v1/stocks/quotes/${stockSymbol}/?token=${process.env.STOCK_API_KEY2}`
    );

    const stockQuotes = await stockQuotesJSON.json();

    // const stockCandlesJSON = await fetch(
    //   `https://api.marketdata.app/v1/stocks/candles/D/${stockSymbol}/?from=2020-01-01&to=2020-12-31&token=${process.env.STOCK_API_KEY2}`
    // );

    const stockCandlesJSON = await fetch(
      `https://api.marketdata.app/v1/stocks/candles/5/AAPL/?from=2025-01-29&token=dmlRaXgtM0taZF9nUkJxMjZjaHVWTVFDVFBRSHc2ZlI1bWdPZWFEdVNfWT0`
    );

    const stockCandles = await stockCandlesJSON.json();

    const companyNews = await fetchStockNews();

    const companyProfile = await fetchCompanyInfo();

    const companyFinancials = await fetchCompanyFinancials();

    res.json({
      stockQuotes,
      stockCandles,
      companyNews,
      companyProfile,
      companyFinancials,
    });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to fetch stock data" });
  }
});

// * Get all stocks
router.get("/", async (req, res) => {
  const stocks = await Stock.findAll();

  return res.json({
    message: "successfully retrieved all stocks",
    stocks,
  });
});

module.exports = router;
