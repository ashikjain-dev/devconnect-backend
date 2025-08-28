const { authRouter } = require("./auth");
const { requestRouter } = require("./request");
const { userRouter } = require("./user");
const { userConnectionRouter } = require("./userConnection");
const { getAllChats } = require("./chat");
module.exports = {
  authRouter,
  requestRouter,
  userRouter,
  userConnectionRouter,
  getAllChats,
};
