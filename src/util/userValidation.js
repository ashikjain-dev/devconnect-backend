const validator = require("validator");
const isValidateUser = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is mandatory.");
  } else if (firstName < 4 || firstName > 50) {
    throw new Error(
      "Name must be equal or greater than 4 and less or equal to 50"
    );
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be minimum of length 8 which must have 1 caps,1 lower ,1 symbol and a number atleast."
    );
  } else {
    return true;
  }
};

const isValidLogin = (req) => {
  const { emailId } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Credentials is invalid");
  } else {
    return true;
  }
};

module.exports = { isValidateUser, isValidLogin };
