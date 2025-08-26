const mongoose = require("mongoose");
require("dotenv").config();

//const URI = process.env.DB_CONNECTION_STRING;
const mongoConnect = async () => {
  await mongoose.connect(
    "mongodb+srv://ashikjain44:fUqnmxgpOl6o8jth@cluster0.g99wkhh.mongodb.net/DevConnect"
  );
};

module.exports = {
  mongoConnect,
};
