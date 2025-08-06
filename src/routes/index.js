const { authRouter } = require("./auth");
const { requestRouter } = require("./request");
const { userRouter } = require("./user");
const { userConnectionRouter } = require("./userConnection");

module.exports = {
  authRouter,
  requestRouter,
  userRouter,
  userConnectionRouter,
};
