const router = require("express").Router();
const {
  restoreUser,
} = require("../../utils/auth.js");
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const transactionsRouter = require("./transactions.js");


router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/transactions", transactionsRouter);


module.exports = router;
