const express = require("express");
const { ConnectionRequest } = require("../models/connectionRequest");

const { userAuth, checkRequiredFields } = require("../middlewares/");

const requestRouter = express.Router();

//send a connection request
requestRouter.post(
  "/connectionrequest/:status/:userId",
  userAuth,
  checkRequiredFields,
  async (req, res) => {
    try {
      const user = req.user;
      const connection = new ConnectionRequest({
        fromUserId: user.id,
        toUserId: req.params.userId,
        status: req.params.status,
      });
      await connection.save();
      res.send(user.firstName + " sending the connection request");
    } catch (error) {
      console.error(error);
      res.status(401).send("ERROR : " + error.message);
    }
  }
);

module.exports = {
  requestRouter,
};
