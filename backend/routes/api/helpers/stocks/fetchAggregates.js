const { StockPriceTimestamp } = require("../../../../db/models/index.js");

const { getDate } = require("../getDate.js");

async function fetchOneMonthAndFiveYearsAggregates(stockId) {
  if (!stockId) {
    throw new Error("Stock ID is required");
  }

  try {
    const [oneMonthData, fiveYearsData] = await Promise.all([
      StockPriceTimestamp.findAll({
        where: { stockId, interval: "1H" },
        order: [["timestamp", "ASC"]],
      }),

      StockPriceTimestamp.findAll({
        where: { stockId, interval: "1D" },
        order: [["timestamp", "ASC"]],
      }),
    ]);

    return { oneMonthData, fiveYearsData };
  } catch (error) {
    console.error("Error fetching stock aggregates:", error);
    throw error;
  }
}

async function fetchOneDayAndOneWeekAggregates(stockSymbol) {
  if (!stockSymbol) {
    throw new Error("No stock symbol provided");
  }

  const todaysDate = getDate();
  const oneDayAway = getDate(1);
  const oneWeekAway = getDate(7);

  try {
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

    // If oneDayData is empty, use oneWeekData as fallback
    if (!oneDayData.results || oneDayData.results.length === 0) {
      oneDayData = oneWeekData;
    }

    return { oneDayData, oneWeekData };
  } catch (error) {
    console.error("Error fetching stock time series:", error);
    throw error;
  }
}

module.exports = {
  fetchOneMonthAndFiveYearsAggregates,
  fetchOneDayAndOneWeekAggregates,
};
