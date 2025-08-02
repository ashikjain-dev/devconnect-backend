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

//display one user details
app.get("/profile", async (req, res) => {
  try {
    const { emailId } = req.body;
    const userInfo = await User.findOne({});
    if (!userInfo) {
      res.status(404).send("User not found.");
    } else {
      res.send(userInfo);
    }
  } catch (error) {
    console.error("error while fetching user data", error);
    res.status(501).send("Something went wrong.");
  }
});

//display all user details
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (allUsers.length === 0) {
      res.status(404).send("User details not found");
    } else {
      res.send(allUsers);
    }
  } catch (error) {
    console.error("error while fetching all user details", error);
    res.status(501).send("Something went wrong.");
  }
});

//find the user detail by emailId and update his firstname
app.post("/update", async (req, res) => {
  try {
    const { emailId } = req.body;
    const updateInfo = req.body;
    console.info(updateInfo);
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      res.status(404).send("User details not found");
    } else {
      user.firstName = updateInfo.firstName;
      user.lastName = updateInfo.lastName;
      user.password = updateInfo.password;
      console.log("user info :::", user);
      await user.save();
      res.send("Update is done ");
    }
  } catch (error) {
    console.error("error while update the data", error);
    res.status(501).send("Something went wrong");
  }
});

//delete the user from the database
app.delete("/delete", async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.deleteOne({ emailId: emailId });
    console.log(user);
    if (user.deletedCount === 0) {
      res.status(404).send("Document not found");
    } else {
      res.send("Delete the document successfully.");
    }
  } catch (error) {
    console.error("error while fetching and deleting the user details");
    console.error(error);
    res.status(500).send("Something went wrong");
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
