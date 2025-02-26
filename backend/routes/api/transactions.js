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

  // Aggregation helper: rounds each point down to the bucket start and picks the latest point per bucket.
  function aggregatePoints(points, bucketDurationMs) {
    const buckets = {};
    points.forEach((point) => {
      // Round down the timestamp to the start of the bucket.
      const bucketKey =
        Math.floor(point.x / bucketDurationMs) * bucketDurationMs;
      // Keep the point with the latest timestamp and override x with the bucketKey.
      if (!buckets[bucketKey] || point.x > buckets[bucketKey].x) {
        buckets[bucketKey] = { ...point, x: bucketKey };
      }
    });
    return Object.values(buckets).sort((a, b) => a.x - b.x);
  }

  // Define basic time durations in milliseconds.
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneHourMs = 60 * 60 * 1000;

  // Get the current time and today's midnight timestamp.
  const now = Date.now();
  const todayMidnightTimestamp = new Date().setHours(0, 0, 0, 0);

  // For each timeframe, first filter the points to include only data older than today (before midnight)
  // and within the desired timeframe.

  // One Day (last 24 hours) aggregated to 5-minute buckets:
  const oneDayData = userHistoricalData.filter(
    (point) => point.x >= now - oneDayMs && point.x < todayMidnightTimestamp
  );
  const oneDayFiveMinAggregates = aggregatePoints(oneDayData, 5 * 60 * 1000);

  // One Week (last 7 days) aggregated to 1-hour buckets:
  const oneWeekMs = 7 * oneDayMs;
  const oneWeekData = userHistoricalData.filter(
    (point) => point.x >= now - oneWeekMs && point.x < todayMidnightTimestamp
  );
  const oneWeekOneHourAggregates = aggregatePoints(oneWeekData, oneHourMs);

  // One Month (last 30 days) aggregated to 1-hour buckets:
  const oneMonthMs = 30 * oneDayMs;
  const oneMonthData = userHistoricalData.filter(
    (point) => point.x >= now - oneMonthMs && point.x < todayMidnightTimestamp
  );
  const oneMonthOneHourAggregates = aggregatePoints(oneMonthData, oneHourMs);

  // Three Months (last 90 days) aggregated to 1-day buckets:
  const threeMonthMs = 90 * oneDayMs;
  const threeMonthData = userHistoricalData.filter(
    (point) => point.x >= now - threeMonthMs && point.x < todayMidnightTimestamp
  );
  const threeMonthOneDayAggregates = aggregatePoints(threeMonthData, oneDayMs);

  // One Year (last 365 days) aggregated to 1-day buckets:
  const oneYearMs = 365 * oneDayMs;
  const oneYearData = userHistoricalData.filter(
    (point) => point.x >= now - oneYearMs && point.x < todayMidnightTimestamp
  );
  const oneYearOneDayAggregates = aggregatePoints(oneYearData, oneDayMs);

  // Five Years (last 5 years) aggregated to 1-day buckets:
  const fiveYearMs = 5 * oneYearMs;
  const fiveYearData = userHistoricalData.filter(
    (point) => point.x >= now - fiveYearMs && point.x < todayMidnightTimestamp
  );
  const fiveYearOneDayAggregates = aggregatePoints(fiveYearData, oneDayMs);

  // Now organize the results into an object:
  const aggregates = {
    oneDayFiveMinAggregates,
    oneWeekOneHourAggregates,
    oneMonthOneHourAggregates,
    threeMonthOneDayAggregates,
    oneYearOneDayAggregates,
    fiveYearOneDayAggregates,
  };

  console.log(aggregates);

  const userSummary = {
    totalInvestments: lastTransaction.totalInvestments,
    balance: lastTransaction.balance,
    stocksOwned: lastTransaction.stocksOwned,
    // fiveMinAggregates: userHistoricalData,
    // oneHourUserAggregates: oneHourUserAggregates,
    // oneDayAggregates: oneDayUserAggregates,
    oneDayFiveMinAggregates,
    oneWeekOneHourAggregates,
    oneMonthOneHourAggregates,
    threeMonthOneDayAggregates,
    oneYearOneDayAggregates,
    fiveYearOneDayAggregates,
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
    order: [["purchaseDate", "DESC"]], // change to 'createdAt' if that's your timestamp field
    include: [
      {
        model: Stock,
        attributes: ["id", "stockSymbol", "stockName"],
      },
    ],
  });

  console.log(recentTransaction);

  const userTransactions = await StockUserTransaction.findAll({
    where: { userId: id },
    include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
  });

  // user balances is updated
  // newBalance - we have
  // totalInvestments we can ignore
  // stocksOwned is updated

  const safeUser = {
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
    balance: req.user.balance,
    profilePic: req.user.profilePic,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    joinDate: req.user.createdAt,
  };

  return res.json({
    // transaction,
    // balance: newBalance,
    // stockSummary,
    user: safeUser,
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
