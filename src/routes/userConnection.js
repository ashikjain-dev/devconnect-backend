const express = require("express");

const { userAuth } = require("../middlewares/");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

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
      res.json({ interestedConnection });
    } catch (error) {
      console.error(error.message);
      res.status(401).send("ERROR : " + error.message);
    }
  }
);

//feed users to the loggedIn user
userConnectionRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 10 : limit;
    const skip = (page - 1) * limit;
    //get user connection for the loggedInuser
    const connectionExist = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser.id,
        },
        { toUserId: loggedInUser.id },
      ],
    });
    //store unique user from connectionExist in a set
    let hideUserFromFeed = new Set();
    connectionExist.map((row) => {
      hideUserFromFeed.add(row.fromUserId.toString());
      hideUserFromFeed.add(row.toUserId.toString());
    });
    //query user collection and fetch user details other than users from the set
    const data = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser.id } },
      ],
    })
      .select(dataArray)
      .skip(skip)
      .limit(limit);

    res.json({ message: "You can send request to these people", data });
  } catch (error) {
    console.error(error.message);
    res.status(400).send("ERROR : " + error.message);
  }
});
module.exports = {
  userConnectionRouter,
};
