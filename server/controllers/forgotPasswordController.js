// const forgotPassword = require("express").Router();
// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const User = require("../models/user");
// const passResetToken = require("../models/passResetToken");

// forgotPassword.post(
// 	"/",
// 	body("email").normalizeEmail().isEmail(),
// 	async (req, res, next) => {
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			return next(new Error("Invalid email, please check your input."));
// 		}

// 		const { email } = req.body;

// 		let bhulakkadUser;
// 		try {
// 			bhulakkadUser = await User.findOne({ email: email });
// 		} catch (err) {
// 			return next(new Error("Something went wrong! Please try again."));
// 		}

// 		if (!bhulakkadUser) {
// 			return next(new Error("No such user found!"));
// 		}

// 		const token = new passResetToken({
// 			userId: bhulakkadUser.id,
// 			token: crypto.randomBytes(16).toString("hex"),
// 		});

// 		// Save the verification token
// 		try {
// 			await token.save();
// 		} catch (err) {
// 			console.log(err);
// 			return next(new Error("Password Reset Token generation failed"));
// 		}

// 		// Send the email
// 		let transporter = nodemailer.createTransport({
// 			host: "smtp.mailtrap.io",
// 			port: 2525,
// 			auth: {
// 				user: process.env.MAILTRAP_ID, //generated by Mailtrap
// 				pass: process.env.MAILTRAP_PWD, //generated by Mailtrap
// 			},
// 		});

// 		let mailOptions = {
// 			from: `"CryptoX" <${process.env.COMPANY_MAIL}>`,
// 			to: bhulakkadUser.email,
// 			subject: "Reset Password | CryptoX",
// 			text:
// 				"Hey " +
// 				bhulakkadUser.name +
// 				",\n\n" +
// 				"You can reset your account's password by clicking the link: \n" +
// 				req.header('Referer') +
// 				"resetpassword/" +
// 				token.token +
// 				"\n\nThis link will expire in 10 mins. Ignore the mail if not requested." +
// 				"\n\n\n\nRegards,\nCryptoX\n\nKeep Minting! :)",
// 		};

// 		let info;
// 		try {
// 			info = await transporter.sendMail(mailOptions);
// 		} catch (err) {
// 			console.log(err);
// 			return next(new Error("Unable to send Password Reset mail."));
// 		}

// 		res.status(200).json({
// 			message: "Password Reset Email sent!",
// 			mailinfo: info.messageId,
// 		});
// 	}
// );

// forgotPassword.post(
// 	"/reset",
// 	body("newPassword").isLength({ min: 6 }),
// 	async (req, res, next) => {
// 		const { newPassword, token } = req.body;

// 		// Find a matching token
// 		let tokenData;
// 		try {
// 			tokenData = await passResetToken
// 				.findOne({ token: token })
// 				.populate("userId")
// 				.exec();
// 		} catch (err) {
// 			console.log(err);
// 			return next(new Error(err.message));
// 		}

// 		if (tokenData == null) {
// 			return next(new Error("Invalid token. Your token may have expired."));
// 		}

// 		// If we found a token, accessing the populated matching user
// 		const user = tokenData.userId;

// 		let hashedPassword;
// 		try {
// 			hashedPassword = await bcrypt.hash(newPassword, 12);
// 		} catch (err) {
// 			return next(
// 				new Error("Could not reset password, please try again. " + err.message)
// 			);
// 		}

// 		// Updating password and saving the user
// 		user.password = hashedPassword;
// 		try {
// 			await user.save();
// 		} catch (err) {
// 			console.log(err);
// 			return next(new Error("Unable to reset. Please try later."));
// 		}

// 		res.status(201).json({
// 			message: "Password reset successfull.",
// 		});
// 	}
// );

// module.exports = forgotPassword;
