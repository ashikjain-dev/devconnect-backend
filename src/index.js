const express = require("express");

const app = express();

const { mongoConnect } = require("./config/mongo");

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
