// backend/routes/index.js
const express = require("express");
const router = express.Router();

const apiRouter = require("./api");
router.use("/api", apiRouter);

router.use((req, res, next) => {
  console.log(`entering routes/index.js`)
  next()
})


router.get("/api/csrf/restore", (req, res) => {
  console.log('hello')
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    "XSRF-Token": csrfToken,
  });
});



module.exports = router;
