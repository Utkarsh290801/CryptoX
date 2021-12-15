const mongoose = require("mongoose");

const addMoneySchema = new mongoose.Schema(
	{
		walletId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wallet",
		},
		amount: {
			type: String,
			required: true,
		},
		status: {
			type: Number,
			required: true,
		},
		razorpay_payment_id: {
			type: String,
			required: true,
			default: null,
		},
		razorpay_order_id: {
			type: String,
			required: true,
		},
		razorpay_signature: {
			type: String,
			required: true,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("addMoney", addMoneySchema);

// STATUS CODE
// 1: SUCCESS/CAPTURED
// 2: PENDING