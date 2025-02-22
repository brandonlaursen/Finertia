const express = require("express");
const router = express.Router();
const {
  User,
  UserTransaction,
  StockUserTransaction,
  Stock,
} = require("../../db/models");

router.post("/deposit", async (req, res) => {
  const { id, balance } = req.user;

  const { amount } = req.body;

  const user = await User.findByPk(id);

  const newBalance = balance + Number(amount);

  await user.update({
    balance: newBalance,
  });

  const transaction = {
    amount,
    transactionType: "deposit",
    transactionDate: new Date(),
  };

  await UserTransaction.create({
    userId: id,
    ...transaction,
  });

  return res.json({
    transaction,
    balance: newBalance,
    message: `successfully deposited ${amount} for user with id of ${id}, new balance is ${newBalance}`,
  });
});

router.post("/withdraw", async (req, res) => {
  const { id, balance } = req.user;

  const { amount } = req.body;

  const user = await User.findByPk(id);

  const newBalance = balance - amount;

  if (newBalance < 0) {
    return res.json({
      message: `Not enough funds`,
      balance,
    });
  }

  await user.update({
    balance: newBalance,
  });

  const transaction = {
    amount,
    transactionType: "withdraw",
    transactionDate: new Date(),
  };

  await UserTransaction.create({
    userId: id,
    ...transaction,
  });

  return res.json({
    transaction,
    balance: newBalance,
    message: `successfully withdrew ${amount} for user with id of ${id}, new balance is ${newBalance}`,
  });
});

router.get("/stock-transactions", async (req, res) => {
  const { id } = req.user;

  const userTransactions = await StockUserTransaction.findAll({
    where: { userId: id },
    include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
  });

  const transactions = userTransactions.map((transaction) => {
    const {
      stockId,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
      Stock,
    } = transaction;

    return {
      stockId,
      stockSymbol: Stock.stockSymbol,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
    };
  });

  return res.json({
    transactions,
    message: `successfully retrieved transactions for user with id of ${id}`,
  });
});

router.get("/stock-summary", async (req, res) => {
  const { id } = req.user;

  const MULTIPLIER_100000 = 100000;
  const MULTIPLIER_100 = 100;

  const userTransactions = await StockUserTransaction.findAll({
    where: { userId: id },
    include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
    order: [["purchaseDate", "ASC"]],
  });

  const accountTransactions = await UserTransaction.findAll({
    where: { userId: id },
  });


  // * TIMEFRAMES
  // - 1y/YTD/3m - 1d intervals
  // - 1m/1w/1d - 1 hour intervals
  // - 1d - 5min intervals

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


  const allTransactions = [...accountTransactions, ...userTransactions];
  console.log(allTransactions)

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


  // console.log("STOCK SHARE TRACKER", { stockSharesTracker });
  // console.log("CURRENT TRANSACTION GROUP", { currentTransactionGroup5min });

  // console.log('----', accountTransactions)
  // for (let accountTransaction of accountTransactions) {
  //   let { amount, transactionType, transactionDate } = accountTransaction;
  //   const roundedTo5minUnix = roundToNearestIntervalInUnix(transactionDate, 5);


  //   if (!stockSharesTracker['buyingPower']) {
  //     stockSharesTracker['buyingPower'] = 0;
  //   }

  //   let balance = stockSharesTracker['buyingPower'];
  //   console.log(" balance:", balance);


  //   const currentBalance =
  //     Math.round(Number(balance) * MULTIPLIER_100) / MULTIPLIER_100;
  //   const currentAmount =
  //     Math.round(Number(amount) * MULTIPLIER_100) / MULTIPLIER_100;

  //   if (transactionType === "deposit") {
  //     const newBalance =
  //       Math.round(Number(currentBalance + currentAmount) * MULTIPLIER_100) /
  //       MULTIPLIER_100;

  //     stockSharesTracker['buyingPower'] = newBalance;
  //   } else if (transactionType === "withdraw") {
  //     const newBalance =
  //       Math.round(Number(currentBalance - currentAmount) * MULTIPLIER_100) /
  //       MULTIPLIER_100;

  //     stockSharesTracker['buyingPower'] = newBalance;
  //   }

  //   if (!currentTransactionGroup5min[roundedTo5minUnix]) {
  //     currentTransactionGroup5min[roundedTo5minUnix] = {
  //       accountBalance: stockSharesTracker['buyingPower'],
  //     };
  //   }
  // }

  // console.log(stockSharesTracker)
  return res.json({});
});


router.get("/stock-summary", async (req, res) => {
  const { id } = req.user;

  const MULTIPLIER_100000 = 100000;
  const MULTIPLIER_100 = 100;

  const userTransactions = await StockUserTransaction.findAll({
    where: { userId: id },
    include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
  });

  //(Shares Owned×Stock Price at Time)+Cash Balance+Other Assets
  // The percentage change displayed (e.g., +3.5% today) is calculated relative to the starting portfolio value of the selected time range.

  const transactions = userTransactions.map((transaction) => {
    const {
      stockId,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
      Stock,
    } = transaction;

    return {
      stockId,
      stockName: Stock.stockName,
      stockSymbol: Stock.stockSymbol,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
    };
  });

  const stockSummary = {};

  transactions.forEach((transaction) => {
    const {
      stockId,
      stockName,
      stockSymbol,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
    } = transaction;

    if (!stockSummary[stockSymbol]) {
      stockSummary[stockSymbol] = {
        stockId,
        stockName,
        stockSymbol,
        sharesOwned: 0,
        totalAmountOwned: 0,
        transactions: [],
      };
    }

    // current user values
    const sharesOwned = stockSummary[stockSymbol].sharesOwned;
    const totalAmountOwned = stockSummary[stockSymbol].totalAmountOwned;

    // rounded user values
    const roundedSharesOwned =
      Math.round(Number(sharesOwned) * MULTIPLIER_100000) / MULTIPLIER_100000;
    const roundedTotalAmountOwned =
      Math.round(Number(totalAmountOwned) * MULTIPLIER_100) / MULTIPLIER_100;

    // rounded stock quantity
    const roundedQuantity =
      Math.round(Number(quantity) * MULTIPLIER_100000) / MULTIPLIER_100000;
    // rounded stock price
    const roundedPrice =
      Math.round(Number(purchasePrice) * MULTIPLIER_100) / MULTIPLIER_100;

    if (transactionType === "buy") {
      stockSummary[stockSymbol].sharesOwned =
        Math.round((roundedSharesOwned + roundedQuantity) * MULTIPLIER_100000) /
        MULTIPLIER_100000;

      stockSummary[stockSymbol].totalAmountOwned =
        Math.round(
          (roundedTotalAmountOwned + roundedQuantity * roundedPrice) *
            MULTIPLIER_100
        ) / MULTIPLIER_100;
    } else if (transactionType === "sell") {
      stockSummary[stockSymbol].sharesOwned =
        Math.round((roundedSharesOwned - roundedQuantity) * MULTIPLIER_100000) /
        MULTIPLIER_100000;

      stockSummary[stockSymbol].totalAmountOwned =
        Math.round(
          (roundedTotalAmountOwned - roundedQuantity * roundedPrice) *
            MULTIPLIER_100
        ) / MULTIPLIER_100;
    }

    if (stockSummary[stockSymbol].sharesOwned > 0) {
      stockSummary[stockSymbol].transactions.push({
        stockId,
        stockName,
        stockSymbol,
        transactionType: transaction.transactionType,
        quantity,
        purchasePrice,
        purchaseDate,
      });
    }
  });

  for (const stockSymbol in stockSummary) {
    const stockData = stockSummary[stockSymbol];

    if (stockData.totalAmountOwned <= 0 || stockData.sharesOwned <= 0) {
      delete stockSummary[stockSymbol];
    } else {
      stockData.averageCost = Number(
        (stockData.totalAmountOwned / stockData.sharesOwned).toFixed(2)
      );
    }
  }

  // console.log('STOCK SUMMARY =====>',{stockSummary})

  return res.json({
    stockSummary,
  });
});

router.post("/trade/:stockId", async (req, res) => {
  const { id, balance } = req.user;

  const { stockId, price, quantity, transactionType, stockName, stockSymbol } =
    req.body;

  console.log({
    stockId,
    price,
    quantity,
    transactionType,
    stockName,
    stockSymbol,
  });
  const user = await User.findByPk(id);

  // Constants
  const MULTIPLIER_100000 = 100000;
  const MULTIPLIER_100 = 100;

  // Round price and quantity
  const roundedPrice =
    Math.round(Number(price) * MULTIPLIER_100) / MULTIPLIER_100;
  const roundedQuantity =
    Math.round(Number(quantity) * MULTIPLIER_100000) / MULTIPLIER_100000;

  // Calculate amount (price * quantity)
  const amount = roundedPrice * roundedQuantity;

  // Round the amount to 2 decimal places (since it's a currency value)
  const roundedAmount = Math.round(amount * MULTIPLIER_100) / MULTIPLIER_100;

  let newBalance;
  if (transactionType === "buy") {
    newBalance = balance - roundedAmount;
  } else if (transactionType === "sell") {
    newBalance = balance + roundedAmount;
  }

  newBalance = Math.round(newBalance * MULTIPLIER_100) / MULTIPLIER_100;

  const transaction = await StockUserTransaction.create({
    userId: id,
    stockId,
    transactionType,
    quantity,
    stockName,
    stockSymbol,
    purchasePrice: price,
    purchaseDate: new Date(),
  });

  await user.update({
    balance: newBalance,
  });

  const userTransactions = await StockUserTransaction.findAll({
    where: { userId: id },
    include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
  });

  const transactions = userTransactions.map((transaction) => {
    const {
      stockId,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
      Stock,
    } = transaction;

    return {
      stockId,
      stockName: Stock.stockName,
      stockSymbol: Stock.stockSymbol,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
    };
  });

  const stockSummary = {};

  transactions.forEach((transaction) => {
    const {
      stockId,
      stockName,
      stockSymbol,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
    } = transaction;

    if (!stockSummary[stockSymbol]) {
      stockSummary[stockSymbol] = {
        stockId,
        stockName,
        stockSymbol,
        sharesOwned: 0,
        totalAmountOwned: 0,
        transactions: [],
      };
    }

    // current user values
    const sharesOwned = stockSummary[stockSymbol].sharesOwned;
    const totalAmountOwned = stockSummary[stockSymbol].totalAmountOwned;

    // rounded user values
    const roundedSharesOwned =
      Math.round(Number(sharesOwned) * MULTIPLIER_100000) / MULTIPLIER_100000;
    const roundedTotalAmountOwned =
      Math.round(Number(totalAmountOwned) * MULTIPLIER_100) / MULTIPLIER_100;

    // rounded stock quantity
    const roundedQuantity =
      Math.round(Number(quantity) * MULTIPLIER_100000) / MULTIPLIER_100000;
    // rounded stock price
    const roundedPrice =
      Math.round(Number(purchasePrice) * MULTIPLIER_100) / MULTIPLIER_100;

    if (transactionType === "buy") {
      stockSummary[stockSymbol].sharesOwned =
        Math.round((roundedSharesOwned + roundedQuantity) * MULTIPLIER_100000) /
        MULTIPLIER_100000;

      stockSummary[stockSymbol].totalAmountOwned =
        Math.round(
          (roundedTotalAmountOwned + roundedQuantity * roundedPrice) *
            MULTIPLIER_100
        ) / MULTIPLIER_100;
    } else if (transactionType === "sell") {
      stockSummary[stockSymbol].sharesOwned =
        Math.round((roundedSharesOwned - roundedQuantity) * MULTIPLIER_100000) /
        MULTIPLIER_100000;

      stockSummary[stockSymbol].totalAmountOwned =
        Math.round(
          (roundedTotalAmountOwned - roundedQuantity * roundedPrice) *
            MULTIPLIER_100
        ) / MULTIPLIER_100;
    }

    if (stockSummary[stockSymbol].sharesOwned > 0) {
      stockSummary[stockSymbol].transactions.push({
        stockId,
        stockName,
        stockSymbol,
        transactionType: transaction.transactionType,
        quantity,
        purchasePrice,
        purchaseDate,
      });
    }
  });

  for (const stockSymbol in stockSummary) {
    const stockData = stockSummary[stockSymbol];

    if (stockData.totalAmountOwned <= 0 || stockData.sharesOwned <= 0) {
      delete stockSummary[stockSymbol];
    } else {
      stockData.averageCost = Number(
        (stockData.totalAmountOwned / stockData.sharesOwned).toFixed(2)
      );
    }
  }

  // const highestPriceEntry = await StockPriceTimestamp.findOne({
  //   where: {
  //     stockId: stock.id,
  //   },
  //   order: [
  //     ["timestamp", "DESC"],
  //   ],
  //   limit: 1,
  // });

  return res.json({
    transaction,
    balance: newBalance,
    stockSummary,
    message: `successfully retrieved transactions for user with id of ${id}`,
  });
});

// * Get users transactions
router.get("/", async (req, res) => {
  const { id } = req.user;

  const userTransactions = await UserTransaction.findAll({
    where: {
      userId: id,
    },
  });

  const transactions = userTransactions.map((transaction) => {
    const { amount, transactionType, transactionDate } = transaction;
    return {
      amount,
      transactionType,
      transactionDate,
    };
  });

  return res.json({
    transactions,
    message: `successfully retrieved transactions for user with id of ${id}`,
  });
});
module.exports = router;
