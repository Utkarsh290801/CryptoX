const referral = require("express").Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

const User = require("../models/user");
const authVerify = require("../middlewares/authVerify");
const user = require("../models/user");

referral.post("/invite", async (req, res, next) => {
	console.log(req.body);
	const { inviteLink, emailToSend } = req.body;

	// Send the email
	let transporter = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: process.env.MAILTRAP_ID, //generated by Mailtrap
			pass: process.env.MAILTRAP_PWD, //generated by Mailtrap
		},
	});
	console.log(inviteLink);
	let mailOptions = {
		from: `"CryptoX" <${process.env.COMPANY_MAIL}>`,
		to: emailToSend,
		subject: "Invitation to Register | CryptoX",
		text:
			"Hello there,\n\n" +
			"Register at CryptoX by clicking the below link and get Rs. 100 as bonus cash.\nLink: " +
			inviteLink +
			"\n\n\nRegards,\nCryptoX\n\nKeep Minting! :)",
	};

	let info;
	try {
		info = await transporter.sendMail(mailOptions);
	} catch (err) {
		console.log(err);
		return next(new Error("Unable to send Email Verification mail."));
	}

	res.status(200).json({
		message: "Invite Sent!",
		mailinfo: info.messageId,
	});
});

referral.use(authVerify);

referral.get("/getcode", async (req, res, next) => {
	let user;
	try {
		user = await User.findById(req.userData.id).exec();
	} catch {
		return next(new Error("Unable to find user."));
	}

	res.status(200).json({
		email: user.email,
		refcode: user.referralID,
	});
});

module.exports = referral;