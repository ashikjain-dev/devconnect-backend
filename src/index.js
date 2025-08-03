const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { mongoConnect } = require("./config/mongo");
const { User } = require("./models/user");
const { isValidateUser, isValidLogin } = require("./util/userValidation");
const { userAuth } = require("../middlewares/index");

const app = express();

// parses the raw JSON string from the request body and converts it into a JavaScript object.
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 'extended: true' allows parsing nested objects and arrays
app.use(cookieParser()); //parsed cookie header and populate req.cookies with an object keyed by the cookie names.

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
      const isPassword = await userInfo.comparePassword(password);
      if (!isPassword) {
        throw new Error("Invalid credentials");
      }
      //jwt token created and include in a cookie.
      const token = await userInfo.getJWT();
      res.cookie("token", token, { maxAge: 120000 });
      res.send("Login is successful.");
    }
  } catch (error) {
    console.error(error);
    res.status(401).send("ERROR : " + error.message);
  }
});

//display the user profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(401).send("ERROR : " + error.message);
  }
});

//send a connection request
app.post("/sendConnectionReq", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sending the connection request");
  } catch (error) {
    console.error(error);
    res.status(401).send("ERROR : " + error.message);
  }
});

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
