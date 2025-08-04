const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { userAuth } = require("../../middlewares");
const {
  editFieldsCheck,
  allowedFieldsForPasswordCheck,
} = require("../../middlewares/user");
const userRouter = express.Router();

//display the user profile
userRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(401).send("ERROR : " + error.message);
  }
});

//edit a user profile
userRouter.patch(
  "/profile/edit",
  userAuth,
  editFieldsCheck,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      //  console.log("loggedInUser details before :", loggedInUser);
      Object.keys(req.body).forEach(
        (field) => (loggedInUser[field] = req.body[field])
      );
      //  console.log("loggedInUser details after :", loggedInUser);
      await loggedInUser.save();
      res.json({
        message: `${loggedInUser.firstName}, your profile has been updated`,
        data: loggedInUser,
      });
    } catch (error) {
      console.error(error.message);
      res.status(401).send("ERROR : " + error.message);
    }
  }
);
//update only password
userRouter.patch(
  "/profile/updatePassword",
  userAuth,
  allowedFieldsForPasswordCheck,
  async (req, res, next) => {
    try {
      const user = req.user;
      const { newPassword } = req.body;
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);
      user.password = passwordHash;
      user.save();
      res.send(`${user.firstName} your password has been updated successfully`);
    } catch (error) {
      console.error(error.message);
      res.status(401).send("ERROR : " + error.message);
    }
  }
);
//delete the user from the database by using id
userRouter.delete("/profile", userAuth, async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByIdAndDelete(id);

    if (!user || user?.deletedCount === 0) {
      res.status(404).send("Document not found");
    } else {
      res.send("Deleted the document successfully.");
    }
  } catch (error) {
    console.error("error while fetching and deleting the user details");
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

module.exports = {
  userRouter,
};
