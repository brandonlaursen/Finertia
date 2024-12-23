const router = require("express").Router();
const {
  restoreUser,
} = require("../../utils/auth.js");
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");


router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);


module.exports = router;
