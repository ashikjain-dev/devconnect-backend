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
    const userObj = req.body;
    if (!userObj) {
      throw new Error("Body should not be null or undefined.");
    }
    const user = new User(userObj);
    await user.save();
    res.send("User data saved successfully.");
  } catch (error) {
    console.error("error while saving a user data", error);
    res.status(400).send(error.message);
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

//find the user detail by id and update details. id from params field
app.patch("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updateInfo = req.body;
    const ALLOWED_OPTIONS = ["age", "skills", "photoUrl", "password", "bio"];
    if (!allowedUpdates(ALLOWED_OPTIONS, updateInfo)) {
      throw new Error(
        "Update is not allowed other than" + JSON.stringify(ALLOWED_OPTIONS)
      );
    }
    const user = await User.findByIdAndUpdate(userId, updateInfo, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("User details not found");
    } else {
      res.send("Update is done ");
    }
  } catch (error) {
    console.error("error while update the data", error);
    res.status(400).send(error.message);
  }
});

//check allowed update details for the user
function allowedUpdates(ALLOWED_OPTIONS, updateInfo) {
  return Object.keys(updateInfo).every((key) => ALLOWED_OPTIONS.includes(key));
}
//delete the user from the database by using id
app.delete("/user", async (req, res) => {
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

app.delete("/allusers", async (req, res) => {
  try {
    const count = await User.deleteMany({});
    console.log(count);
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
app.use("/", (req, res) => {
  res.status(404).send("Not implemented");
});
mongoConnect()
  .then(() => {
    console.log("connection to mongodb is successful.");
    app.listen("7777", () => {
      console.log("The app is running on port 7777");
    });
  })
  .catch((error) => {
    console.error("connection is failed..");
  });
