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

  console.log(transactions);
  return res.json({
    transactions,
    message: `successfully retrieved transactions for user with id of ${id}`,
  });
});

router.post("/buy/:stockId", async (req, res) => {
  const { id, balance } = req.user;
  console.log("balance:", balance);
  const { stockId, price, quantity } = req.body;
  console.log(req.body);
  const amount = +price * +quantity;
  console.log("amount:", amount);
  const newBalance = Math.round(balance - Number(amount));
  console.log("newBalance:", newBalance);

  const user = await User.findByPk(id);
  console.log("user", user);
  await user.update({
    balance: newBalance,
  });

  const transaction = await StockUserTransaction.create({
    userId: id,
    stockId,
    transactionType: "buy",
    quantity,
    purchasePrice: price,
    purchaseDate: new Date(),
  });

  console.log("transaction:", transaction);

  console.log(user);
  return res.json({
    transaction,
    balance:newBalance,
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
