const express = require("express");

const { userAuth } = require("../middlewares/");
const { ConnectionRequest } = require("../models/connectionRequest");

const userConnectionRouter = express.Router();
//data send from api
const dataArray = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "bio",
  "skills",
  "photoUrl",
];
// send data as string
// const dataString = "firstName lastName age gender bio skills photoUrl";
//User Connection Request which are accepted
userConnectionRouter.get(
  "/user/connection/accepted",
  userAuth,
  async (req, res) => {
    try {
      //get loggedIn user
      const loggedInUser = req.user;
      //query db to get all the connections which are in accepted state and loggedInUser may be in fromUserId or in toUserId
      const connectionsArray = await ConnectionRequest.find({
        $or: [
          {
            fromUserId: loggedInUser.id,
            status: "accepted",
          },
          {
            toUserId: loggedInUser.id,
            status: "accepted",
          },
        ],
      })
        .populate("fromUserId", dataArray)
        .populate("toUserId", dataArray);
      const data = connectionsArray.map((row) => {
        // if row.fromUserId is equal to loggedInUser than send toUserId else send fromUserId
        if (row.fromUserId._id.equals(loggedInUser.id)) {
          return row.toUserId;
        }
        return row.fromUserId;
      });

      res.json({ data });
    } catch (error) {
      console.error(error.message);
      res.status(400).send("ERROR : " + error.message);
    }
  }
);
userConnectionRouter.get(
  "/user/connection/interested",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const interestedConnection = await ConnectionRequest.find({
        $or: [{ toUserId: loggedInUser.id, status: "interested" }],
      }).populate("fromUserId", dataArray);
      const data = interestedConnection.map((row) => row.fromUserId);

      res.json({ data });
    } catch (error) {
      console.error(error.message);
      res.status(401).send("ERROR : " + error.message);
    }
  }
);

module.exports = {
  userConnectionRouter,
};
