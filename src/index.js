const express = require("express");

const app = express();

const { mongoConnect } = require("./config/mongo");
const { User } = require("./models/user");

// parses the raw JSON string from the request body and converts it into a JavaScript object.
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 'extended: true' allows parsing nested objects and arrays

//sign up a user
app.post("/signup", async (req, res) => {
  try {
    console.log("req body", req.body);
    const userObj = req.body;
    if (!userObj) {
      throw new Error("Body should not be null or undefined.");
    }
    const user = new User(userObj);
    await user.save();
    res.send("User data saved successfully.");
  } catch (error) {
    console.error("error while saving a user data", error);
    res.status(400).send("Error while saving a user data.");
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
