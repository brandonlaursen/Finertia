const express = require("express");
const router = express.Router();
const {
  User,
  UserTransaction,
  StockUserTransaction,
  Stock,
} = require("../../db/models");

const processTransactionSummary = require("./helpers/processTransactionSummary.js");
const processHistoricalData = require("./helpers/processHistoricalData.js");
const mergeTransactionAndAggregateData = require("./helpers/mergeTransactionAndAggregateData.js");
const { getDate } = require("./helpers/getDate.js");

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

  const [userTransactions, accountTransactions] = await Promise.all([
    StockUserTransaction.findAll({
      where: { userId: id },
      include: [
        { model: Stock, attributes: ["id", "stockSymbol", "stockName"] },
      ],
      order: [["purchaseDate", "ASC"]],
    }),
    UserTransaction.findAll({
      where: { userId: id },
    }),
  ]);

  const processedTransactions = processTransactionSummary(
    userTransactions,
    accountTransactions
  );

  const processedHistoricalData = await processHistoricalData(
    processedTransactions
  );

  const mergedTransactionData = mergeTransactionAndAggregateData(
    processedTransactions,
    processedHistoricalData
  );

  const mergedTransactionDataArray = Object.values(mergedTransactionData);

  const lastTransaction =
    mergedTransactionDataArray[mergedTransactionDataArray.length - 1];

  const userHistoricalData = Object.values(mergedTransactionData).map(
    (data) => ({
      x: data.timestamp,
      y: data.totalInvestments,
    })
  );

  function aggregatePoints(points, bucketDurationMs) {
    const buckets = {};
    points.forEach((point) => {
      // Round down the timestamp to the start of the bucket.
      const bucketKey =
        Math.floor(point.x / bucketDurationMs) * bucketDurationMs;
      // For each bucket, keep the point with the latest timestamp.
      if (!buckets[bucketKey] || point.x > buckets[bucketKey].x) {
        buckets[bucketKey] = point;
      }
    });
    // Return the aggregated points sorted by time.
    return Object.values(buckets).sort((a, b) => a.x - b.x);
  }

  // Define bucket durations in milliseconds.
  const oneHourMs = 60 * 60 * 1000;
  const oneDayMs = 24 * oneHourMs;

  // Aggregate to hourly and daily snapshots.
  const oneHourUserAggregates = aggregatePoints(userHistoricalData, oneHourMs);

  const oneDayUserAggregates = aggregatePoints(userHistoricalData, oneDayMs);

  

  const userSummary = {
    totalInvestments: lastTransaction.totalInvestments,
    balance: lastTransaction.balance,
    stocksOwned: lastTransaction.stocksOwned,
    fiveMinAggregates: userHistoricalData,
    oneHourUserAggregates: oneHourUserAggregates,
    oneDayAggregates: oneDayUserAggregates,
  };

  return res.json(userSummary);
});

router.post("/trade/:stockId", async (req, res) => {
  const { id, balance } = req.user;

  const {
    stockId,
    stockPrice,
    quantity,
    transactionType,
    stockName,
    stockSymbol,
  } = req.body;

  console.log({
    stockId,
    stockPrice,
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
    Math.round(Number(stockPrice) * MULTIPLIER_100) / MULTIPLIER_100;
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
    purchasePrice: roundedAmount,
    purchaseDate: new Date(),
  });

  await user.update({
    balance: newBalance,
  });

  // pass rounded amount to front end to add to totalInvestments
  // pass newBalance for balance
  // add stocksOwned to

  const recentTransaction = await StockUserTransaction.findOne({
    where: { userId: id },
    order: [['purchaseDate', 'DESC']], // change to 'createdAt' if that's your timestamp field
    include: [{
      model: Stock,
      attributes: ['id', 'stockSymbol', 'stockName']
    }]
  });

  console.log(recentTransaction)

  const userTransactions = await StockUserTransaction.findAll({
    where: { userId: id },
    include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
  });

// user balances is updated
// newBalance - we have
// totalInvestments we can ignore
// stocksOwned is updated




  return res.json({
    // transaction,
    // balance: newBalance,
    // stockSummary,
    user: req.user,
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
