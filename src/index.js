const express = require("express");

const app = express();

const { userAuth, adminAuth } = require("../middlewares");

//middleware to parse JSON and URL encoded data for post method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//user and admin routes with authentication check from middlewares
app.use("/admin", adminAuth);
app.get("/admin/:id", (req, res) => {
  console.log("all data displayed");
  res.send("Displaying all data.");
});
app.delete("/admin/deletuser/:id", (req, res, next) => {
  console.log("in delete route handler");
  res.send("deleting in progress");
});
app.use("/user", userAuth);
app.get("/user/:id", (req, res, next) => {
  console.log("user is authenticated");
  res.send("your profile is here");
});

//routes to show error handles
app.use("/account", (req, res, next) => {
  throw new Error("Error message");
});
// handles get method for a route /profile
app.get("/profile/:id", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  res.send({ name: "Ashik", country: "India" });
});

// handles post method for a route /profile
app.post("/profile", (req, res) => {
  console.log("data =>", req.body);
  res.send("Data saved successfully...");
});

//handles put method for a route /profile
app.put("/profile", (req, res) => {
  res.send("Updated profile successfully...");
});

//handles delete method for a route /profile
app.delete("/profile/:id", (req, res) => {
  console.log("id of a user to delete the profile", req.params);
  res.send("Deleted profile successfully...");
});
app.use("/", (err, req, res, next) => {
  console.error("error from route", err);
  console.log("req path:", req.url);
  res.status(500).send("Something went wrong");
});
app.listen("7777", () => {
  console.log("The app is running on port 7777");
});
