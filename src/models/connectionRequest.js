const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        lowercase: true,
        message: "{VALUE} is not of required type",
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.indexes({ fromUserId: 1, toUserId: 1 }); //1 is ascending order and -1 is descending order.
connectionRequestSchema.pre("save", async function (next) {
  const user = this;
  const { fromUserId, toUserId } = user;
  if (fromUserId.equals(toUserId)) {
    throw new Error("you cannot send request to yourself");
  }
  next();
});

const ConnectionRequest = mongoose.model("connection", connectionRequestSchema);
module.exports = {
  ConnectionRequest,
};
