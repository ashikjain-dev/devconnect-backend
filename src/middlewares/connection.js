const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const checkRequiredFields = async (req, res, next) => {
  try {
    //allowed options while sending a connection request :interested and ignored
    const allowedOptions = ["interested", "ignored"];
    const { status } = req.params;
    const { userId } = req.params;
    const user = req.user; //loggedin user
    const { id } = user;
    if (!allowedOptions.includes(status)) {
      throw new Error("Status is not valid.");
    }
    //check if user is sending request to himself or not
    // if (user.id === userId) {
    //   throw new Error("You cannot send the connection request to yourself");
    // }
    //check if reciever user is there or not in the db
    const userExist = await User.findOne({ _id: userId });

    if (!userExist) {
      throw new Error("reciever is not exist.");
    }
    //check if the connection is already present or not
    const isExist = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: id,
          toUserId: userId,
        },
        {
          fromUserId: userId,
          toUserId: id,
        },
      ],
    });
    console.log(isExist);
    if (isExist.length > 0) {
      throw new Error("connection already exist");
    }
    next();
  } catch (error) {
    console.error(error.message);
    res.status(400).send("ERROR : " + error.message);
  }
};

module.exports = {
  checkRequiredFields,
};
