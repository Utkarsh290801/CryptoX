const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();

const addToWatchList = require("../controllers/usersController/addToWatchList");
const login = require("../controllers/usersController/login");
const portfolio = require("../controllers/usersController/portfolio");
const resetPassword = require("../controllers/usersController/resetPassword");
const resetPasswordRequest = require("../controllers/usersController/resetPasswordRequest");
const signup = require("../controllers/usersController/signup");

const authVerify = require("../middlewares/authVerify");

router.post(
	"/signup",
	[
		check("name").not().isEmpty(),
		check("email").normalizeEmail().isEmail(),
		check("mobile").isLength({ min: 10, max: 10 }),
		check("password").isLength({ min: 6 }),
	],
	signup
);

router.post(
	"/login",
	[check("email").normalizeEmail().isEmail()],
	login
);

router.post(
	"/resetPasswordReq",
	body("email").normalizeEmail().isEmail(),
	resetPasswordRequest
);

router.post(
	"/reset",
	body("newPassword").isLength({ min: 6 }),
	resetPassword
);

router.use(authVerify);

router.get("/portfolio", portfolio);
router.get("/addToWatchList:id", addToWatchList);

module.exports = router;
