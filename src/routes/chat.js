const express = require("express");
const { userAuth } = require("../middlewares/");
const { Chat } = require("../models/chat");
const getAllChats = express.Router();

getAllChats.post("/getAllChats", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // console.log(loggedInUser);
    const { chatUserId } = req.body;
    const chat = await Chat.findOne({
      participants: { $all: [loggedInUser._id, chatUserId] },
    }).populate({ path: "message.senderId", select: "firstName lastName" });
    if (!chat) {
      return res.json({ message: "No previous chat found", chat: [] });
    }

    res.json({ message: "Got few previous messages", chat });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error(error.message);
  }
});

module.exports = { getAllChats };
