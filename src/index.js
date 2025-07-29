const express = require("express");

const app = express();

//middleware to parse JSON and URL encoded data for post method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen("7777", () => {
  console.log("The app is running on port 7777");
});
