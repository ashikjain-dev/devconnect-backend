const express = require("express");
const bcrypt = require("bcrypt");

const { mongoConnect } = require("./config/mongo");
const { User } = require("./models/user");
const { isValidateUser, isValidLogin } = require("./util/userValidation");

const app = express();

// parses the raw JSON string from the request body and converts it into a JavaScript object.
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 'extended: true' allows parsing nested objects and arrays

//sign up a user
app.post("/signup", async (req, res) => {
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
      res.send("User data saved successfully.");
    }
  } catch (error) {
    console.error("error while saving a user data", error);
    res.status(400).send(error.message);
  }
});
//signin a user
app.post("/login", async (req, res) => {
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
      const isPassword = await bcrypt.compare(password, userInfo.password);
      if (!isPassword) {
        throw new Error("Invalid credentials");
      }
      res.send("Login is successful.");
    }
  } catch (error) {
    console.error(error);
    res.status(401).send("ERROR : " + error.message);
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
