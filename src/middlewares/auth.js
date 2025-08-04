const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const adminAuth = (req, res, next) => {
  console.log("in admin auth middleware");
  const auth = false;
  if (!auth) {
    res.status(401).send("you are not the admin.");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  try {
    //get token from cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid credentials");
    }
    //decode the data object from the token
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id } = decodedObj;
    //find the user in the DB
    const user = await User.findById(id);
    if (!user) {
      throw new Error("user is not found");
    }
    //append the user to req.user object and call next()
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send("ERROR : " + error.message);
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
