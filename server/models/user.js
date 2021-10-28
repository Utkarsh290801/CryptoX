const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	mobile: {
		type: String,
		required: true,
	},
	isVerified: {
		type: Boolean,
		default: false,
		required: true,
	},
	referralID: {
		type: String,
		required: true,
	},
	referredBy: {
		type: String,
		default: null,
	},
	walletId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Wallet",
		required: true,
	},
	portfolioId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Portfolio",
		required: true,
	},
	watchList: [
		{
			type: String,
			required: true,
		},
	],
	// image: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
