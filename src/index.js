const express = require("express");

const cookieParser = require("cookie-parser");

const { mongoConnect } = require("./config/mongo");
const {
  authRouter,
  requestRouter,
  userRouter,
  userConnectionRouter,
} = require("./routes/");

const app = express();

// parses the raw JSON string from the request body and converts it into a JavaScript object.
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 'extended: true' allows parsing nested objects and arrays
app.use(cookieParser()); //parsed cookie header and populate req.cookies with an object keyed by the cookie names.

app.use("/", authRouter, userRouter, requestRouter, userConnectionRouter);
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
  .catch(() => {
    console.error("connection is failed..");
  });
