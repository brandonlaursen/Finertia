const router = require("express").Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie } = require("../../utils/auth.js");

const { User } = require("../../db/models");
const bcrypt = require("bcryptjs");

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// * Sign up
router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    balance: Number(user.balance),
    profilePic: user.profilePic,
    firstName: user.firstName,
    lastName: user.lastName,
    joinDate: user.createdAt,
  };

  await setTokenCookie(res, safeUser);

  const stockSummary = {
    totalInvestments: 0,
    balance: 0,
    stocksOwned: {},
    oneDayAggregates: [],
    oneWeekAggregates: [],
    oneMonthAggregates: [],
    threeMonthsAggregates: [],
    oneYearAggregates: [],
    fiveYearsAggregates: [],
  };
  return res.json({
    user: safeUser,
    stockSummary
  });
});

module.exports = router;
