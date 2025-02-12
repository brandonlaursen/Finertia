const express = require("express");
const router = express.Router();
const {
  User,
  UserTransaction,
  StockUserTransaction,
  Stock,
} = require("../../db/models");
const { Op, Transaction } = require("sequelize");

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
    where: {
      userId: id,
    },
  });

  const transactions = userTransactions.map((transaction) => {
    const { stockId, transactionType, quantity, purchasePrice, purchaseDate } =
      transaction;
    return {
      stockId,
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

router.post("/buy/:stockId", async (req, res) => {
  const { id, balance } = req.user;

  const { stockId, price, quantity, transactionType } = req.body;
  const user = await User.findByPk(id);

  const amount = +price * +quantity;

  let newBalance;
  if(transactionType === 'buy') {
    newBalance = Math.round(balance - Number(amount));
  } else if(transactionType === 'sell') {
    newBalance = Math.round(balance + Number(amount));
  }

  await user.update({
    balance: newBalance,
  });

  console.log(newBalance)
  const transaction = await StockUserTransaction.create({
    userId: id,
    stockId,
    transactionType,
    quantity,
    purchasePrice: price,
    purchaseDate: new Date(),
  });

  console.log(transaction)
  return res.json({
    transaction,
    balance: newBalance,
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
