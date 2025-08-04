const validator = require("validator");
const validateUserInput = (userInputFields) => {
  try {
    const { firstName, lastName, age, gender, skills, bio, photoUrl } =
      userInputFields;

    if (firstName !== undefined) {
      if (validator.isEmpty(firstName)) {
        throw new Error("firstname must contain atleast 4 characters");
      }
      if (firstName.length < 4 || firstName.length > 50) {
        throw new Error(
          "first name must be greater than 4 and less than 50 characters"
        );
      }
    }
    if (lastName !== undefined) {
      if (validator.isEmpty(lastName)) {
        throw new Error("last name must contain atleast 1 character");
      }
      if (lastName.length > 50) {
        throw new Error("last name must be less than 50 characters.");
      }
    }
    if (age) {
      if (age < 14) {
        throw new Error("Age should be greater than 14.");
      }
    }
    if (gender) {
      const allowedGender = ["male", "female", "others"];
      if (!allowedGender.includes(gender.toLowerCase())) {
        throw new Error("Gender must be either male,female or others");
      }
    }
    if (skills) {
      if (skills.length > 20) {
        throw new Error("please provide less than 20 skills");
      }
    }
    if (photoUrl !== undefined) {
      if (!validator.isURL(photoUrl)) {
        throw new Error("please provide valid photo url.");
      }
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { validateUserInput };
