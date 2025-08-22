const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { userAuth, adminAuth } = require("../middlewares/");
const { isValidateUser, isValidLogin } = require("../util/userValidation");

const authRouter = express.Router();
//sign up a user
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    //validation of req.body
    if (isValidateUser(req)) {
      //encrypt user password using bcrypt
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);
      //save hashpassword in the DB
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashPassword,
      });
      await user.save();
      //get jwt token and store it in cookie
      const token = await user.getJWT();
      res.cookie("token", token, { maxAge: 900000 }); //15 mins
      res.send("User data saved successfully.");
    }
  } catch (error) {
    console.error("error while saving a user data", error);
    res.status(400).send(error.message);
  }
});
//signin a user
authRouter.post("/login", async (req, res) => {
  try {
    //validation of email
    const { emailId, password } = req.body;

    if (isValidLogin(req)) {
      //user details fetch from DB by using emailId
      const userInfo = await User.findOne({ emailId });
      if (!userInfo) {
        throw new Error("Invalid credentials");
      }
      //compare user password with hashpassword
      const isPassword = await userInfo.comparePassword(password);
      if (!isPassword) {
        throw new Error("Invalid credentials");
      }
      //jwt token created and include in a cookie.
      const token = await userInfo.getJWT();
      res.cookie("token", token, { maxAge: 900000 });
      res.json(userInfo);
    }
  } catch (error) {
    console.error(error.message);
    res.status(401).send("ERROR : " + error.message);
  }
});
//logout from the user profile
authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("Logout successfully.");
  } catch (error) {
    console.error(error.message);
    res.status(401).send("ERROR : " + error.message);
  }
});

//delete all existing users in the DB
authRouter.delete("/allusers", adminAuth, async (req, res) => {
  try {
    const count = await User.deleteMany({});
    if (count.deletedCount === 0) {
      res.status(400).send("No documents found");
    } else {
      res.send("Deleted all documents successfully.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Delete is not possible");
  }
});
module.exports = {
  authRouter,
};
