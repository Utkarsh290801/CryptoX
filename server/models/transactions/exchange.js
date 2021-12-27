const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema(
	{
		wallet: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wallet",
		},
		coinid1: {
			type: String,
			required: true,
		},
		coinid2: {
			type: String,
			required: true,
		},
		amount: {
			type: String,
			required: true,
		},
		price1: {
			type: String,
			required: true,
		},
		price2: {
			type: String,
			required: true,
		},
		quantitySendForExchange: {
			type: String,
			required: true,
		},
		quantityRecieved: {
			type: String,
			required: true,
		},
		chargedQuantity: {
			type: String,
			required: true,
		},
		chargedMoney: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: ["SUCCESS", "PENDING", "FAILED"],
		},
		statusMessage: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("exchange", exchangeSchema);
