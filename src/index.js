const express = require("express");

const app = express();

app.use("/profile", (req, res) => {
  res.send("Profile Page loading ...");
});

app.use("/feeds", (req, res) => {
  res.send("ALL Developers profile...");
});

app.use("/", (req, res) => {
  res.send("Home Page loading....");
});

app.listen("7777", () => {
  console.log("The app is running on port 7777");
});
