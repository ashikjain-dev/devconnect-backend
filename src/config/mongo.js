const mongoose = require("mongoose");
require("dotenv").config();

//const URI = process.env.DB_CONNECTION_STRING;
const mongoConnect = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
};

module.exports = {
  mongoConnect,
};
