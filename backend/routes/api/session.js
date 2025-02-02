const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie } = require("../../utils/auth.js");
const { User } = require("../../db/models");
const { Op } = require("sequelize");

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

// * Log in
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "The provided credentials were invalid." };
    return next(err);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

// * Get logged in user info
router.get("/", (req, res) => {
  const { user } = req;

  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return res.json({
      user: safeUser,
    });
  } else return res.json({ user: null });
});

// * Edit user info
router.put("/", async (req, res) => {
  const { id } = req.user;

  const {
    email: newEmail,
    username: newUsername,
    firstName: newFirstName,
    lastName: newLastName,
  } = req.body;

  const user = await User.findByPk(id);

  await user.update({
    email: newEmail || email,
    username: newUsername || username,
    firstName: newFirstName || firstName,
    lastName: newLastName || lastName,
  });

  return res.json({
    user,
    message: `Updated user profile with id ${id}`,
  });
});

// * Delete account
router.delete("/", async (req, res) => {
  const { id } = req.user;
  const user = await User.findByPk(id);
  res.clearCookie("token");
  user.destroy();
  return res.json({
    user,
    message: `${user.username} has been deleted`,
  });
});

// * log out
router.get("/logout", (req, res) => {
  const { user } = req;
  res.clearCookie("token");
  return res.json({
    user,
    message: `${user.username} has signed out`,
  });
});

module.exports = router;
