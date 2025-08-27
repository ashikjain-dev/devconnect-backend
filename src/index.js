const express = require("express");
const { createServer } = require("node:http");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const { mongoConnect } = require("./config/mongo");
const { initializeSocket } = require("./util/socket");
const {
  authRouter,
  requestRouter,
  userRouter,
  userConnectionRouter,
} = require("./routes/");

const app = express();
const server = createServer(app);
initializeSocket(server);

//pass options to cors which allows frontend domain and send credentials too
const corsOptions = {
  origin: ["http://localhost:5173", "http://13.201.103.69"], //allow request only from this site
  credentials: true, // Allow sending cookies/authorization headers
};
//Enable cors for all routes and origins
app.use(cors(corsOptions));

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
    server.listen("7777", () => {
      console.log("The app is running on port 7777");
    });
  })
  .catch(() => {
    console.error("connection is failed..");
  });
