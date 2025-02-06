const express = require("express");
const router = express.Router();
const { Stock, StockList } = require("../../db/models");
const { Op } = require("sequelize");
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
      where: {
        stockSymbol,
      },
      include: [StockList],
    });

    const listIds = stock.StockLists.map((stock) => stock.id);

    return res.json({ stock, listIds });
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
    const stocks = await response.json();

    return res.json(stocks);
  } catch (error) {
    res.status(500).json({ error, message: "Failed to fetch stock data" });
  }
});

module.exports = router;
