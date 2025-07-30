const adminAuth = (req, res, next) => {
  console.log("in admin auth middleware");
  const auth = true;
  if (!auth) {
    res.status(401).send("you are not the admin.");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("in user auth middleware");
  const auth = true;
  if (!auth) {
    res.status(401).send("you dont have a profile");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
