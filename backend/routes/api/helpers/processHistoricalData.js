const { getDate } = require("./getDate.js");
async function processHistoricalData(processedTransactions) {
  const todaysDate = getDate();


  // * users first transaction
  const firstTimestamp = Math.min(
    ...Object.keys(processedTransactions).map(Number)
  );
  const firstTransaction = processedTransactions[firstTimestamp];
  const firstTransactionTimestamp = firstTransaction.unixTimestamp;

  // * get users last transaction
  const lastTimestamp = Math.max(
    ...Object.keys(processedTransactions).map(Number)
  );
  const lastTransaction = processedTransactions[lastTimestamp];
  const stocksOwnedOverTime = [
    ...Object.keys(lastTransaction.stockSharesOwned),
  ];

  const aggregateData = {};
  const allTimestamps = new Set();

  for (let stockSymbol of stocksOwnedOverTime) {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/5/minute/${firstTransactionTimestamp}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
    );
    const data = await response.json();
    const currentStocksAggregates = data.results || [];

    for (let aggregate of currentStocksAggregates) {
      const timestamp = aggregate.t;

      if (!aggregateData[timestamp]) {
        aggregateData[timestamp] = {};
      }

      aggregateData[timestamp][stockSymbol] = {
        price: aggregate.c, // Closing price
      };

      allTimestamps.add(timestamp);
    }
  }

  // Convert Set to sorted array of timestamps
  const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

  // Ensure each stock has a value at every timestamp
  for (let timestamp of sortedTimestamps) {
    for (let stockSymbol of Object.keys(stocksOwnedOverTime)) {
      if (!aggregateData[timestamp]) {
        aggregateData[timestamp] = {};
      }
      if (!aggregateData[timestamp][stockSymbol]) {
        const lastPrice = findClosestPrice(
          aggregateData,
          stockSymbol,
          timestamp,
          sortedTimestamps
        );
        aggregateData[timestamp][stockSymbol] = {
          price: lastPrice,
        };
      }
    }
  }

  return aggregateData;
}

// Find the closest price for a stock before OR after a given timestamp
function findClosestPrice(data, stockSymbol, timestamp, sortedTimestamps) {
  // 1Find the closest past timestamp with a price
  let pastTimestamps = sortedTimestamps.filter(
    (t) => t < timestamp && data[t]?.[stockSymbol]
  );
  let closestPastTimestamp = pastTimestamps.length
    ? pastTimestamps[pastTimestamps.length - 1]
    : null;

  // If no past price, look forward
  let futureTimestamps = sortedTimestamps.filter(
    (t) => t > timestamp && data[t]?.[stockSymbol]
  );
  let closestFutureTimestamp = futureTimestamps.length
    ? futureTimestamps[0]
    : null;

  // Prioritize past price if available, otherwise use future price
  if (closestPastTimestamp)
    return data[closestPastTimestamp][stockSymbol].price;
  if (closestFutureTimestamp)
    return data[closestFutureTimestamp][stockSymbol].price;

  return null; // No price available at all
}

module.exports = processHistoricalData;
