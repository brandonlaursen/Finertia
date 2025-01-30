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

    // const historicalDataJSON2 = await fetch(
    //   `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history?symbol=${stockSymbol}&interval=1wk&diffandsplits=false`,
    //   options
    // );
    // const historicalData2 = await historicalDataJSON2.json();

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
  console.log("entering sever");
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
    console.log("result:", result);

    return res.json({
      result,
      message: "successfully retrieved all stocks",
    });
  } catch (error) {
    res.status(500).json({ error, message: "Failed to fetch stock data" });
  }
});

// // * Get a single stock
// router.get("/:stockSymbol/:time", async (req, res) => {
//   const { stockSymbol, time } = req.params;
//   let resolution = "5";

//   if (time.includes("&")) {
//     resolution = "h";
//   }
//   console.log(time);
//   console.log("resolution:", resolution);

//   const api_key = finnhub.ApiClient.instance.authentications["api_key"];
//   api_key.apiKey = process.env.STOCK_API_KEY;
//   const finnhubClient = new finnhub.DefaultApi();

//   const fetchStockNews = async () => {
//     return new Promise((resolve, reject) => {
//       finnhubClient.companyNews(
//         stockSymbol,
//         "2025-01-01",
//         "2025-01-28",
//         (error, data, response) => {
//           if (error) {
//             return reject(error); // Handle errors
//           }
//           resolve(data); // Resolve with data
//         }
//       );
//     });
//   };

//   const fetchCompanyInfo = async () => {
//     return new Promise((resolve, reject) => {
//       finnhubClient.companyProfile2(
//         { symbol: stockSymbol },
//         (error, data, response) => {
//           if (error) {
//             return reject(error); // Handle errors
//           }
//           resolve(data); // Resolve with data
//         }
//       );
//     });
//   };

//   const fetchCompanyFinancials = async () => {
//     return new Promise((resolve, reject) => {
//       finnhubClient.companyBasicFinancials(
//         stockSymbol,
//         "all",
//         (error, data, response) => {
//           if (error) {
//             return reject(error); // Handle errors
//           }
//           resolve(data); // Resolve with data
//         }
//       );
//     });
//   };

//   try {
//     const stockQuotesJSON = await fetch(
//       `https://api.marketdata.app/v1/stocks/quotes/${stockSymbol}/?token=${process.env.STOCK_API_KEY2}`
//     );

//     const stockQuotes = await stockQuotesJSON.json();

//     // const stockCandlesJSON = await fetch(
//     //   `https://api.marketdata.app/v1/stocks/candles/D/${stockSymbol}/?from=2020-01-01&to=2020-12-31&token=${process.env.STOCK_API_KEY2}`
//     // );

//     const stockCandlesJSON = await fetch(
//       `https://api.marketdata.app/v1/stocks/candles/${resolution}/${stockSymbol}/?from=${time}&token=dmlRaXgtM0taZF9nUkJxMjZjaHVWTVFDVFBRSHc2ZlI1bWdPZWFEdVNfWT0`
//     );

//     const stockCandles = await stockCandlesJSON.json();
//     console.log("stockCandles:", stockCandles);

//     const companyNews = await fetchStockNews();

//     const companyProfile = await fetchCompanyInfo();

//     const companyFinancials = await fetchCompanyFinancials();

//     res.json({
//       stockQuotes,
//       stockCandles,
//       companyNews,
//       companyProfile,
//       companyFinancials,
//     });
//   } catch (error) {
//     res.status(500).json({ error, message: "Failed to fetch stock data" });
//   }
// });

module.exports = router;
