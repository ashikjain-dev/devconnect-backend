const express = require("express");

const app = express();

const { mongoConnect } = require("./config/mongo");
const { User } = require("./models/user");

//to read data of json and urlencoded format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//sign up a user
app.post("/signup", async (req, res) => {
  try {
    console.log("req body", req.body);
    const userObj = req.body;
    const user = new User(userObj);
    await user.save();
    res.send("User data saved successfully.");
  } catch (error) {
    console.log("error while saving a user data".error);
    res.status(401).send("Not able to save data.");
  }
});
mongoConnect()
  .then(() => {
    console.log("connection is successful.");
    app.listen("7777", () => {
      console.log("The app is running on port 7777");
    });
  })
  .catch((error) => {
    console.error("connection is failed..");
  });
