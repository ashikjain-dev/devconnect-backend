const socket = require("socket.io");
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
    socket.on("sendMessage", ({ name, userId, chatUserId, newMessage }) => {
      const uniqueRoomKey = [userId, chatUserId].sort().join("_");
      console.log(`${name} sent ${newMessage} to ${uniqueRoomKey}`);
      io.to(uniqueRoomKey).emit("messageRecieved", { name, newMessage });
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = { initializeSocket };
