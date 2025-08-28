const socket = require("socket.io");

const { Chat } = require("../models/chat");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: ["http://localhost:5173", "http://13.201.103.69"] },
  });
  io.on("connection", (socket) => {
    /**
     * handle events
     * join chat
     * send message
     * disconnect
     */
    socket.on("joinChat", ({ name, userId, chatUserId }) => {
      const uniqueRoomKey = [userId, chatUserId].sort().join("_");
      console.log(`${name} has joined the room -> ${uniqueRoomKey}`);
      socket.join(uniqueRoomKey);
    });
    socket.on(
      "sendMessage",
      async ({ name, userId, chatUserId, newMessage }) => {
        try {
          const uniqueRoomKey = [userId, chatUserId].sort().join("_");
          console.log(`${name} sent ${newMessage} to ${uniqueRoomKey}`);
          let chat = await Chat.findOne({
            participants: { $all: [userId, chatUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, chatUserId],
              message: [],
            });
          }
          chat.message.push({ senderId: userId, text: newMessage });
          await chat.save();
          io.to(uniqueRoomKey).emit("messageRecieved", {
            senderId: userId,
            name,
            newMessage,
          });
        } catch (err) {
          console.error(err.message);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = { initializeSocket };
