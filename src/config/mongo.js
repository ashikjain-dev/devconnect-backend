const mongoose = require("mongoose");
const URI =
  "mongodb+srv://ashikjain44:IdrACDel59VyJFBr@cluster0.g99wkhh.mongodb.net/DevConnect";
const mongoConnect = async () => {
  await mongoose.connect(URI);
};

module.exports = {
  mongoConnect,
};
