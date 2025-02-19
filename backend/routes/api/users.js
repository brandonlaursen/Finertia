const router = require("express").Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie } = require("../../utils/auth.js");

const { User } = require("../../db/models");
const bcrypt = require("bcryptjs");


const { singleFileUpload, singleMulterUpload } = require("../../awsS3");

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
    balance: user.balance,
    profilePic: user.profilePic,
    firstName: user.firstName,
    lastName: user.lastName,
    joinDate: user.createdAt,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});


router.post(
  '',
  singleMulterUpload("image"),
  validateSignup,
  async (req, res) => {
    const { password, username } = req.body;
    const profileImageUrl = req.file ?
      await singleFileUpload({ file: req.file, public: true }) :
      null;
    const user = await User.signup({
      username,
      password,
      profileImageUrl
    });

    await setTokenCookie(res, user);

    return res.json({
      user
    });
  }
);

module.exports = router;
