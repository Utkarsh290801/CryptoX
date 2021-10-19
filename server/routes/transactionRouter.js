const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authenticate = require("../middlewares/authVerify");
// router.get("/profile", usersController.profile);
router.post('/buy:id',authenticate.verify,transactionController.buy);
router.post('/sell:id',authenticate.verify,transactionController.sell)
router.post('/buyLimit',authenticate.verify,transactionController.buyLimit);
module.exports = router;