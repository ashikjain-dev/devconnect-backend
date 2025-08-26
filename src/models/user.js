const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      validate(value) {
        if (validator.isEmpty(value)) {
          throw new Error("first Name cannot be empty.");
        }
      },
    },
    lastName: {
      type: String,
      trim: true,
      validate(value) {
        if (validator.isEmpty(value)) {
          throw new Error("last name cannot be empty.");
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid {VALUE}");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must have 8 chars, 1 caps,1 small ,1 symbol and a number atleast."
          );
        }
      },
    },
    age: { type: Number, min: 14 },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female", "others"],
        message: `gender either male,female or others but got {VALUE}`,
      },
    },
    bio: {
      type: String,
      default: "Basic bio information",
    },
    skills: {
      type: [String],
      default: ["JavaScript", "NodeJs", "GitHub"],
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Image url should be valid");
        }
      },
    },
  },
  { timestamps: true }
);
//to create jwt token and include user.id
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ id: user.id }, "Dev1.0.Backend", {
    expiresIn: "1h",
  });
  return token;
};
//to compare user password with passwordhash and return boolean value
userSchema.methods.comparePassword = async function (userInputPassword) {
  const passwordHash = this.password;
  const isValidPassword = await bcrypt.compare(userInputPassword, passwordHash);
  return isValidPassword;
};
const User = mongoose.model("User", userSchema);

module.exports = { User };
