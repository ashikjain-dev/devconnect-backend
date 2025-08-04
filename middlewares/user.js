const { validateUserInput } = require("../src/util/updateUserValidation");
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

module.exports = {
  editFieldsCheck,
};
