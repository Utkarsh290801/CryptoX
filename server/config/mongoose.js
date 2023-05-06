const mongoose = require("mongoose");
const RecurringJobs = require("../recurringJobs/transaction");
require("dotenv").config();

const url =
  "mongodb+srv://utarora:mansha@cluster0.wmuj9.mongodb.net/crypt?retryWrites=true&w=majority";

mongoose.connect(url);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to mongodb"));
db.once("open", () => {
  console.log("Connected to Database :: MongoDB");
  RecurringJobs.checkLimitBuy();
});

module.exports = db;
