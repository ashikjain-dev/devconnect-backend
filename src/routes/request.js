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

//accept or reject the existing request
requestRouter.post(
  "/connectionrequest/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // get status and requestId from req.params
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      //allow only these status to change ["accepted","rejected"]
      const allowedStatus = ["accepted", "rejected"];
      console.log(status);
      if (!allowedStatus.includes(status)) {
        throw new Error("status now allowed");
      }
      //check is the request exist along with state in interested and toId should be matched to loggedInUser;
      const isExistRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser.id,
        status: "interested",
      });
      if (!isExistRequest) {
        return res.status(404).send("Request not found");
      }
      isExistRequest.status = status.toLowerCase();
      const data = await isExistRequest.save();
      res.json({
        message: `you ${status} the connection request `,
        data,
      });
    } catch (error) {
      console.error(error.message);
      res.status(400).send("ERROR : " + error.message);
    }
  }
);
module.exports = {
  requestRouter,
};
