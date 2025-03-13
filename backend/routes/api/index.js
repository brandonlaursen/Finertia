const router = require("express").Router();
const { restoreUser } = require("../../utils/auth.js");


const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const transactionsRouter = require("./transactions.js");
const stocksRouter = require("./stocks.js");
const stockListsRouter = require("./lists.js");
const searchRouter = require("./search.js");

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/stocks", stocksRouter);
router.use("/transactions", transactionsRouter);
router.use("/lists", stockListsRouter);
router.use("/search", searchRouter);

module.exports = router;
