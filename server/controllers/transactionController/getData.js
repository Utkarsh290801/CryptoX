const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

const User = require("../../models/user");
const Transaction = require("../../models/transaction");
const converter = require("../conversions");

const getTransactionList = async (req, res, next) => {
	const count = req.query.count;

	try {
		const user = await User.findById(req.userData.id)
			.populate({
				path: "wallet",
				populate: {
					path: "transactionList",
					select: "-wallet -__v -createdAt -updatedAt",
					populate: [
						{
							path: "addMoney",
							select: "-_id -wallet -razorpay_signature -razorpay_payment_id -__v",
						},
						{
							path: "buyCoin",
							select: "-_id amount status coinid updatedAt",
						},
						{
							path: "sellCoin",
							select: "-_id amount status coinid updatedAt",
						},
						{
							path: "buyLimit",
							select: "-_id -wallet -__v",
						},
						{
							path: "sellLimit",
							select: "-_id -wallet -__v",
						},
						{
							path: "withdrawMoney",
							select: "-_id amount status updatedAt",
						},
						{
							path: "sendCoin",
							select: "-_id -wallet -__v",
						},
						{
							path: "receiveCoin",
							select: "-_id -wallet -__v",
						},
						{
							path: "exchange",
							select: "-_id -wallet -__v",
						},
					],
				},
			})
			.exec();

		const transactionDataArray = user.wallet.transactionList;
		let transactionDataList = [];

		// Reverse loop so that recent transaction is shown first
		let size = transactionDataArray.length;
		let limit = count ? (size > count ? size - count : 0) : 0;
		for (let i = size - 1; i >= limit; i--) {
			let transItem = transactionDataArray[i];
			let tType, tDate, isPlus, tAmount, isSuccess, tStatus, tCoinID, tCoinID2, tNextPath;
			tCoinID2 = "unspecified";
			if (transItem.category === "add_money") {
				tType = "Add Money";
				tDate = transItem.addMoney.updatedAt;
				isPlus = true;
				isSuccess = transItem.addMoney.status === "SUCCESS";
				tStatus = transItem.addMoney.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				tAmount = converter.amountToDecimalString(transItem.addMoney.amount);
				tCoinID = "-";
				tNextPath = "add";
			} else if (transItem.category === "buy_coin") {
				tType = "Buy";
				tDate = transItem.buyCoin.updatedAt;
				isPlus = false;
				isSuccess = transItem.buyCoin.status === "SUCCESS";
				tStatus = transItem.buyCoin.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				tAmount = converter.amountToDecimalString(transItem.buyCoin.amount);
				tCoinID = transItem.buyCoin.coinid;
				tNextPath = "buysell";
			} else if (transItem.category === "sell_coin") {
				tType = "Sell";
				tDate = transItem.sellCoin.updatedAt;
				isPlus = true;
				isSuccess = transItem.sellCoin.status === "SUCCESS";
				tStatus = transItem.sellCoin.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				tAmount = converter.amountToDecimalString(transItem.sellCoin.amount);
				tCoinID = transItem.sellCoin.coinid;
				tNextPath = "buysell";
			} else if (transItem.category === "buy_limit") {
				tType = "Buy Limit";
				tDate = transItem.buyLimit.updatedAt;
				isPlus = true;
				isSuccess = transItem.buyLimit.status === "SUCCESS";
				tStatus = transItem.buyLimit.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				if (transItem.buyLimit.status === "SUCCESS") {
					tAmount = converter.amountToDecimalString(transItem.buyLimit.amount);
				} else {
					tAmount = "-";
				}
				tCoinID = transItem.buyLimit.coinid;
				tNextPath = "buyorder";
			} else if (transItem.category === "sell_limit") {
				tType = "Sell Limit";
				tDate = transItem.sellLimit.updatedAt;
				isPlus = true;
				isSuccess = transItem.sellLimit.status === "SUCCESS";
				tStatus = transItem.sellLimit.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				if (transItem.sellLimit.status === "SUCCESS") {
					tAmount = converter.amountToDecimalString(transItem.sellLimit.amount);
				} else {
					tAmount = "-";
				}
				tCoinID = transItem.sellLimit.coinid;
				tNextPath = "sellorder";
			} else if (transItem.category === "withdraw_money") {
				tType = "Withdraw Money";
				tDate = transItem.withdrawMoney.updatedAt;
				isPlus = false;
				isSuccess = transItem.withdrawMoney.status === "SUCCESS";
				tStatus = transItem.withdrawMoney.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				tAmount = converter.amountToDecimalString(transItem.withdrawMoney.amount);
				tCoinID = "-";
				tNextPath = "withdraw";
			} else if (transItem.category === "send_receive") {
				tType = "Send/Receive";
				tDate = transItem.sendCoin.updatedAt;
				isPlus = true;
				isSuccess = transItem.sendCoin.status === "SUCCESS";
				tStatus = transItem.sendCoin.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
				if (transItem.sendCoin.to === user.email) {
					tAmount = converter.amountToDecimalString(transItem.receiveCoin.amount);
				} else {
					tAmount = converter.amountToDecimalString(transItem.sendCoin.amount);
				}
				tCoinID = transItem.sendCoin.coinid;
				tNextPath = "sendrecieve";
			} else if (transItem.category === "exchange") {
				tType = "Exchange";
				tDate = transItem.exchange.updatedAt;
				isPlus = true;
				isSuccess = transItem.exchange.status === "SUCCESS";
				tStatus = transItem.exchange.status;
				tStatus = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);

				tAmount = converter.amountToDecimalString(transItem.exchange.amount);

				tCoinID = transItem.exchange.coinid1;
				tCoinID2 = transItem.exchange.coinid2;
				tNextPath = "exchange";
			}

			let transactionElement = {
				tID: transItem.id,
				tType,
				tDate,
				isPlus,
				tAmount,
				isSuccess,
				tStatus,
				tCoinID,
				tCoinID2,
				tNextPath,
			};

			transactionDataList.push(transactionElement);
		}

		return res.status(200).json(transactionDataList);
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to retrieve Transaction List."));
	}
};

const getTransactionData = async (req, res, next) => {
	const transactionID = req.body.tid;
	const user = await User.findById(req.userData.id);
	try {
		console.log("yes");
		const transactionData = await Transaction.findById(transactionID).populate([
			{
				path: "addMoney",
				select: "-_id -wallet -razorpay_signature -razorpay_payment_id -__v",
			},
			{
				path: "buyCoin",
				select: "-_id -wallet -__v",
			},
			{
				path: "sellCoin",
				select: "-_id -wallet -__v",
			},
			{
				path: "buyLimit",
				select: "-_id -wallet -__v",
			},
			{
				path: "sellLimit",
				select: "-_id -wallet -__v",
			},
			{
				path: "withdrawMoney",
				// select: "-_id -wallet -__v",
			},
			{
				path: "sendCoin",
				select: "-_id -wallet -__v",
			},
			{
				path: "receiveCoin",
				select: "-_id -wallet -__v",
			},
			{
				path: "exchange",
				select: "-_id -wallet -__v",
			},
		]);

		let transactionElement = {};

		if (transactionData.category === "add_money") {
			let innerData = transactionData.addMoney.toJSON();
			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				...innerData,
			};
			transactionElement.amount = converter.amountToDecimalString(innerData.amount);
		} else if (transactionData.category === "buy_coin") {
			let innerData = transactionData.buyCoin.toJSON();
			const { data: coinData } = await CoinGeckoClient.coins.fetch(innerData.coinid, {
				tickers: false,
				market_data: false,
				community_data: false,
				developer_data: false,
				localization: false,
				sparkline: false,
			});

			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				coinName: coinData.name,
				coinSymbol: coinData.symbol.toUpperCase(),
				...innerData,
			};

			transactionElement.amount = converter.amountToDecimalString(innerData.amount);
			transactionElement.quantity = converter.quantityToDecimalString(innerData.quantity);
			transactionElement.price = converter.amountToDecimalString(innerData.price);
		} else if (transactionData.category === "sell_coin") {
			let innerData = transactionData.sellCoin.toJSON();
			const { data: coinData } = await CoinGeckoClient.coins.fetch(innerData.coinid, {
				tickers: false,
				market_data: false,
				community_data: false,
				developer_data: false,
				localization: false,
				sparkline: false,
			});

			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				coinName: coinData.name,
				coinSymbol: coinData.symbol.toUpperCase(),
				...innerData,
			};

			transactionElement.amount = converter.amountToDecimalString(innerData.amount);
			transactionElement.quantity = converter.quantityToDecimalString(innerData.quantity);
			transactionElement.price = converter.amountToDecimalString(innerData.price);
		} else if (transactionData.category === "buy_limit") {
			let innerData = transactionData.buyLimit.toJSON();
			const { data: coinData } = await CoinGeckoClient.coins.fetch(innerData.coinid, {
				tickers: false,
				market_data: false,
				community_data: false,
				developer_data: false,
				localization: false,
				sparkline: false,
			});

			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				coinName: coinData.name,
				coinSymbol: coinData.symbol.toUpperCase(),
				...innerData,
			};

			transactionElement.quantity = converter.quantityToDecimalString(innerData.quantity);
			transactionElement.maxPrice = converter.amountToDecimalString(innerData.maxPrice);
		} else if (transactionData.category === "sell_limit") {
			let innerData = transactionData.sellLimit.toJSON();
			const { data: coinData } = await CoinGeckoClient.coins.fetch(innerData.coinid, {
				tickers: false,
				market_data: false,
				community_data: false,
				developer_data: false,
				localization: false,
				sparkline: false,
			});

			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				coinName: coinData.name,
				coinSymbol: coinData.symbol.toUpperCase(),
				...innerData,
			};

			transactionElement.quantity = converter.quantityToDecimalString(innerData.quantity);
			transactionElement.minPrice = converter.amountToDecimalString(innerData.minPrice);
		} else if (transactionData.category === "withdraw_money") {
			let innerData = transactionData.withdrawMoney;
			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				...innerData,
			};
			transactionElement.amount = converter.amountToDecimalString(innerData.amount);
		} else if (transactionData.category === "exchange") {
			let innerData = transactionData.exchange.toJSON();
			const { data: coinData } = await CoinGeckoClient.coins.fetch(innerData.coinid1, {
				tickers: false,
				market_data: false,
				community_data: false,
				developer_data: false,
				localization: false,
				sparkline: false,
			});

			const { data: coinData2 } = await CoinGeckoClient.coins.fetch(innerData.coinid2, {
				tickers: false,
				market_data: false,
				community_data: false,
				developer_data: false,
				localization: false,
				sparkline: false,
			});
			transactionElement = {
				id: transactionData.id,
				category: transactionData.category,
				isSuccess: innerData.status === "SUCCESS",
				sendCoinName: coinData.name,
				recieveCoinName: coinData2.name,
				sendCoinSymbol: coinData.symbol.toUpperCase(),
				recieveCoinSymbol: coinData2.symbol.toUpperCase(),
				...innerData,
			};

			transactionElement.quantitySendForExchange = converter.quantityToDecimalString(
				innerData.quantitySendForExchange
			);

			transactionElement.quantityRecieved = converter.quantityToDecimalString(
				innerData.quantityRecieved
			);

			transactionElement.amount = converter.amountToDecimalString(innerData.amount);
			transactionElement.chargedQuantity = converter.quantityToDecimalString(
				innerData.chargedQuantity
			);
			transactionElement.chargedMoney = converter.amountToDecimalString(innerData.chargedMoney);
			transactionElement.price1 = converter.amountToDecimalString(innerData.price1);
			transactionElement.price2 = converter.amountToDecimalString(innerData.price2);
		} else if (transactionData.category === "send_receive") {
			let innerData1 = transactionData.sendCoin.toJSON();
			let innerData2 = transactionData.receiveCoin.toJSON();
			const { data: coinData } = await CoinGeckoClient.coins.fetch(innerData1.coinid, {
				tickers: false,
				market_data: false,
				community_data: false,
				developer_data: false,
				localization: false,
				sparkline: false,
			});

			if (innerData1.to === user.email) {
				transactionElement = {
					id: transactionData.id,
					category: transactionData.category,
					isSuccess: innerData1.status === "SUCCESS",
					coinName: coinData.name,
					coinSymbol: coinData.symbol.toUpperCase(),
					...innerData2,
				};

				transactionElement.didIsend = "No";
				transactionElement.amount = converter.amountToDecimalString(innerData2.amount);
			} else {
				transactionElement = {
					id: transactionData.id,
					category: transactionData.category,
					isSuccess: innerData1.status === "SUCCESS",
					coinName: coinData.name,
					coinSymbol: coinData.symbol.toUpperCase(),
					...innerData1,
				};

				transactionElement.didIsend = "Yes";
				transactionElement.amount = converter.amountToDecimalString(innerData1.amount);
			}

			transactionElement.sender = innerData2.from;
			transactionElement.reciever = innerData1.to;

			transactionElement.quantitySendBySender = converter.quantityToDecimalString(
				innerData1.totalQuantity
			);

			transactionElement.quantityRecievedByReciever = converter.quantityToDecimalString(
				innerData2.quantityRecieved
			);

			transactionElement.chargedQuantity = converter.quantityToDecimalString(
				innerData1.chargedQuantity
			);
			transactionElement.chargedMoney = converter.amountToDecimalString(innerData1.chargedMoney);
			transactionElement.price = converter.amountToDecimalString(innerData1.price);
		}

		console.log(transactionElement);

		return res.status(200).json(transactionElement);
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to retrieve Transaction data."));
	}
};

// get Pending & Completed Orders
const getOrders = async (req, res, next) => {
	const count = req.query.count;

	try {
		const user = await User.findById(req.userData.id)
			.populate({
				path: "wallet",
				populate: {
					path: "transactionList",
					match: { category: { $in: ["buy_limit", "sell_limit"] } },
					select: "-wallet -__v -createdAt -updatedAt",
					populate: [
						{
							path: "buyLimit",
							select: "-_id -wallet -__v",
						},
						{
							path: "sellLimit",
							select: "-_id -wallet -__v",
						},
					],
				},
			})
			.exec();

		const transactionDataArray = user.wallet.transactionList;

		let pendingOrders = [];
		let otherOrders = [];

		// Reverse loop so that recent transaction is shown first
		let size = transactionDataArray.length;
		let limit = count ? (size > count ? size - count : 0) : 0;
		for (let i = size - 1; i >= limit; i--) {
			let transItem = transactionDataArray[i];
			let id, type, date, triggerPrice, status, coinID, nextPath, actualPrice;

			if (transItem.category === "buy_limit") {
				id = transItem.id;
				type = "Buy Limit";
				date = transItem.buyLimit.createdAt;
				coinID = transItem.buyLimit.coinid;
				quantity = converter.quantityToDecimalString(transItem.buyLimit.quantity);
				triggerPrice = converter.amountToDecimalString(transItem.buyLimit.maxPrice);
				nextPath = "buyorder";

				if (transItem.buyLimit.status === "PENDING") {
					pendingOrders.push({
						id,
						type,
						date,
						coinID,
						quantity,
						triggerPrice,
						nextPath,
					});
				} else {
					let tStatus = transItem.buyLimit.status;
					status = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
					if (transItem.buyLimit.status === "SUCCESS") {
						actualPrice = converter.amountToDecimalString(transItem.buyLimit.price);
					} else {
						actualPrice = "-";
					}

					otherOrders.push({
						id,
						type,
						date,
						coinID,
						status,
						quantity,
						triggerPrice,
						actualPrice,
						nextPath,
					});
				}
			} else if (transItem.category === "sell_limit") {
				id = transItem.id;
				type = "Sell Limit";
				date = transItem.sellLimit.createdAt;
				coinID = transItem.sellLimit.coinid;
				quantity = converter.quantityToDecimalString(transItem.sellLimit.quantity);
				triggerPrice = converter.amountToDecimalString(transItem.sellLimit.minPrice);
				nextPath = "sellorder";

				if (transItem.sellLimit.status === "PENDING") {
					pendingOrders.push({
						id,
						type,
						date,
						coinID,
						quantity,
						triggerPrice,
						nextPath,
					});
				} else {
					let tStatus = transItem.sellLimit.status;
					status = tStatus.charAt(0) + tStatus.toLowerCase().slice(1);
					if (transItem.sellLimit.status === "SUCCESS") {
						actualPrice = converter.amountToDecimalString(transItem.sellLimit.price);
					} else {
						actualPrice = "-";
					}

					otherOrders.push({
						id,
						type,
						date,
						coinID,
						status,
						quantity,
						triggerPrice,
						actualPrice,
						nextPath,
					});
				}
			}
		}

		return res.status(200).json({ pendingOrders, otherOrders });
	} catch (err) {
		console.log(err);
		return next(new Error("ERR: Unable to retrieve Order List."));
	}
};

module.exports.getTransactionList = getTransactionList;
module.exports.getTransactionData = getTransactionData;
module.exports.getOrders = getOrders;
