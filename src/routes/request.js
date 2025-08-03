const express = require("express");

const { userAuth } = require("../../middlewares/");

const requestRouter = express.Router();

//send a connection request
requestRouter.post("/sendConnectionReq", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sending the connection request");
  } catch (error) {
    console.error(error);
    res.status(401).send("ERROR : " + error.message);
  }
});

module.exports = {
  requestRouter,
};
