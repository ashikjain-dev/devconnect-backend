const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, minLength: 5 },
    lastName: { type: String, trim: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 18,
      trim: true,
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
    photo: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
