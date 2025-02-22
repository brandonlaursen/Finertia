function roundToNearestInterval(timestamp, intervalMinutes) {
  const date = new Date(timestamp);

  if (intervalMinutes >= 1440) {
    // Round to the nearest day (1440 minutes = 24 hours)
    const hours = date.getHours();
    if (hours >= 12) {
      // Round up to the next day
      date.setDate(date.getDate() + 1);
    }
    date.setHours(0, 0, 0, 0);
  } else {
    // Round to the nearest interval in minutes
    const minutes = date.getMinutes();
    const remainder = minutes % intervalMinutes;

    if (remainder >= intervalMinutes / 2) {
      // Round up
      date.setMinutes(minutes + (intervalMinutes - remainder), 0, 0);
    } else {
      // Round down
      date.setMinutes(minutes - remainder, 0, 0);
    }
  }

  return date;
}

function roundToNearestIntervalInUnix(timestamp, intervalMinutes) {
  const date = new Date(timestamp);

  if (intervalMinutes >= 1440) {
    // Round to the nearest day (1440 minutes = 24 hours)
    date.setHours(0, 0, 0, 0); // Set to start of the day
    const hours = date.getHours();
    if (hours >= 12) {
      // Round up to the next day
      date.setDate(date.getDate() + 1);
    }
  } else if (intervalMinutes === 60) {
    // Round to the nearest hour (60 minutes)
    const minutes = date.getMinutes();
    const remainder = minutes % 60;

    if (remainder >= 30) {
      // Round up
      date.setMinutes(0, 0, 0);
      date.setHours(date.getHours() + 1); // Add 1 hour
    } else {
      // Round down
      date.setMinutes(0, 0, 0); // Set minutes to 0
    }
  } else {
    // Round to the nearest interval in minutes
    const minutes = date.getMinutes();
    const remainder = minutes % intervalMinutes;

    if (remainder >= intervalMinutes / 2) {
      // Round up
      date.setMinutes(minutes + (intervalMinutes - remainder), 0, 0);
    } else {
      // Round down
      date.setMinutes(minutes - remainder, 0, 0);
    }
  }

  return date.getTime(); // Return Unix timestamp in ms
}

const updateShares = (stockSymbol, transactionType, quantity) => {
  const stock = stockSharesTracker[stockSymbol];
  if (!stock) return;

  const currentShares =
    Math.round(Number(stock.totalShares) * MULTIPLIER_100000) /
    MULTIPLIER_100000;
  const currentQuantity =
    Math.round(Number(quantity) * MULTIPLIER_100000) / MULTIPLIER_100000;
  const newTotal =
    Math.round(Number(currentShares - currentQuantity) * MULTIPLIER_100000) /
    MULTIPLIER_100000;

  if (transactionType === "buy") {
    const newTotal =
      Math.round(
        Number(currentShares + currentQuantity) * MULTIPLIER_100000
      ) / MULTIPLIER_100000;
    stock.totalShares = newTotal;
  } else if (transactionType === "sell") {
    if (stock.totalShares >= quantity) {
      const newTotal =
        Math.round(
          Number(currentShares - currentQuantity) * MULTIPLIER_100000
        ) / MULTIPLIER_100000;
      stock.totalShares = newTotal;
    } else {
      stock.totalShares = 0;
    }
  }
};



function getUserStockTransactionTimestamps(){
  const stockSharesTracker = {};
  let currentTransactionGroup5min = {};

  for (let transaction of userTransactions) {
    let {
      purchaseDate,
      transactionType,
      quantity,
      purchasePrice,
      stockName,
      stockSymbol,
    } = transaction;

    const roundedTo5minUnix = roundToNearestIntervalInUnix(purchaseDate, 5);

    // Initialize stock tracker if needed
    if (!stockSharesTracker[stockSymbol]) {
      stockSharesTracker[stockSymbol] = {
        stockSymbol,
        stockName,
        totalShares: 0,
      };
    }

    // Check if timestamp exists in the group
    if (!currentTransactionGroup5min[roundedTo5minUnix]) {
      currentTransactionGroup5min[roundedTo5minUnix] = {};
    }

    // Update shares based on transaction
    updateShares(stockSymbol, transactionType, quantity);

    // Check if stock exists for this timestamp and add if necessary
    if (!currentTransactionGroup5min[roundedTo5minUnix][stockSymbol]) {
      currentTransactionGroup5min[roundedTo5minUnix][stockSymbol] = {
        stockName,
        stockSymbol,
        quantity,
        purchaseDate,
        transactionType,
        totalSharesAtTime: stockSharesTracker[stockSymbol].totalShares,
      };
    }
  }

}
