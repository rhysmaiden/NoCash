const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String
  },
  cash: Number,
  socket_id: String
});

const MessageSchema = new Schema({
  text: String,
  user: UserSchema
});

const RoomSchema = new Schema({
  name: String,
  users: [UserSchema],
  messages: [MessageSchema]
});

const Room = mongoose.model("room", RoomSchema);
const Message = mongoose.model("message", MessageSchema);
const User = mongoose.model("user", UserSchema);

module.exports = { Room, Message, User };
