const { validateUserInput } = require("../src/util/updateUserValidation");
const validator = require("validator");
const editFieldsCheck = (req, res, next) => {
  try {
    const edditableFields = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "bio",
      "photoUrl",
    ];
    const userInput = req.body;
    if (Object.keys(userInput).length === 0) {
      throw new Error(
        "You can edit only these fields" + edditableFields.join(" ")
      );
    }
    const isEditAllowed = Object.keys(userInput).every((field) =>
      edditableFields.includes(field)
    );

    if (!isEditAllowed) {
      throw new Error(
        "You can edit only these fields" + edditableFields.join(" ")
      );
    }
    if (!validateUserInput(userInput)) {
      throw new Error("Validation failed");
    }

    next();
  } catch (error) {
    console.error(error.message);
    res.status(400).send("ERROR : " + error.message);
  }
};
const allowedFieldsForPasswordCheck = async (req, res, next) => {
  try {
    const allowedFields = ["currentPassword", "newPassword", "confirmPassword"];
    const userInput = req.body;

    //2 conditions allowed fields are mandatory and req.body shouldn't contain extra fields
    const isAllowedFields = allowedFields.every((field) =>
      userInput.hasOwnProperty(field)
    );
    const isThereAnyExtraFields = Object.keys(userInput).every((key) =>
      allowedFields.includes(key)
    );
    if (!isAllowedFields || !isThereAnyExtraFields) {
      throw new Error(
        "Please provide only these fileds" + allowedFields.join(" ")
      );
    }
    if (userInput.newPassword !== userInput.confirmPassword) {
      throw new Error("password doesn't match");
    }
    const { currentPassword } = req.body;
    const user = req.user;
    const isValidPassword = await user.comparePassword(currentPassword);
    console.log(isValidPassword);
    if (!isValidPassword) {
      throw new Error("current password doesn't match");
    }
    if (!validator.isStrongPassword(req.body.newPassword)) {
      throw new Error(
        "Password must be minimum of length 8 which must have 1 caps,1 lower ,1 symbol and a number atleast."
      );
    }
    next();
  } catch (error) {
    console.error(error.message);
    res.status(400).send("ERROR : " + error.message);
  }
};
module.exports = {
  editFieldsCheck,
  allowedFieldsForPasswordCheck,
};
