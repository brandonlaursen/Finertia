const { Stock, StockPriceTimestamp } = require("../../../../db/models");

const updateStockDB = async (req, res, next) => {
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

module.exports = updateStockDB;
