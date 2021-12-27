// Functions for different conversions

const amountToRupeesPaise = (amt) => {
	amt = amt.padStart(3, "0");

	return {
		Rupees: amt.slice(0, -2),
		Paise: amt.slice(-2),
	};
};

const marketPriceToRupeesPaise = (price) => {
	price = Math.trunc(price * 100);
	price = price.toString();

	return {
		Rupees: price.slice(0, -2),
		Paise: price.slice(-2),
	};
};

const marketPriceToDecimalString = (price) => {
	price = Math.trunc(price * 100);
	price = price.toString();

	return price.slice(0, -2) + "." + price.slice(-2);
};

const amountToDecimalString = (amt) => {
	amt = amt.padStart(3, "0");

	return amt.slice(0, -2) + "." + amt.slice(-2);
};

const quantityToDecimalString = (quantity) => {
	quantity = quantity.padStart(8, "0");

	return quantity.slice(0, -7) + "." + quantity.slice(-7);
};

module.exports.amountToRupeesPaise = amountToRupeesPaise;
module.exports.marketPriceToRupeesPaise = marketPriceToRupeesPaise;
module.exports.quantityToDecimalString = quantityToDecimalString;
module.exports.amountToDecimalString = amountToDecimalString;
module.exports.marketPriceToDecimalString = marketPriceToDecimalString;
