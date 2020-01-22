const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { mongoose } = require("./connection.js");
const { Room, Message, User } = require("./models/models.js");
const ip = require("ip");
console.log(ip.address());

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

function changeMoney(socket_id, amount) {
  User.updateOne({ socket_id: socket_id }, { $inc: { money: amount } }).then(
    user => {
      console.log("Money sent");
    }
  );
}

io.on("connection", async socket => {
  console.log("New connection");

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left the room`
      });
    }
  });

  socket.on(
    "join",
    async ({ nameString: name, roomString: room }, callback) => {
      var user = null;
      let currentRoom;

      console.log("Room name", room);

      socket.join(room);

      //Get or Create Room
      await Room.findOne({ name: room }).then(roomRecord => {
        if (!roomRecord) {
          currentRoom = new Room({
            name: room
          });
          currentRoom.save().then(p => {
            console.log("Return after save", p);
          });
        } else {
          currentRoom = roomRecord;
        }
      });

      await User.findOne({ name: name }).then(async record => {
        //Create new user
        if (record === null) {
          var newUser = new User({
            name: name,
            cash: 100,
            socket_id: socket.id
          });

          newUser.save();

          Room.updateOne({ name: room }, { $push: { users: newUser } }).then(
            roomObect => {
              Room.findOne({ name: room }).then(roomObject => {
                io.in(room).emit("users", roomObject.users);
                io.in(room).emit("messages", roomObject.messages);
              });
            }
          );

          // If user is returning
        } else {
          User.updateOne(
            { name: name },
            { $set: { socket_id: socket.id } }
          ).then(changedUser => {
            console.log(currentRoom.users);
            io.in(room).emit("users", currentRoom.users);
            io.in(room).emit("messages", currentRoom.messages);
          });
        }
      });
    }
  );

  //TODO: CLEANUP OR DLEETE vvvvvvvvv

  //   socket.on("sendMessage", (message, callback) => {
  //     console.log("RECIEVED MESSAGE");
  //     User.findOne({ socket_id: socket.id }).then(user => {
  //       if (!user) {
  //         callback();
  //       } else {
  //         console.log("SEND MESSAGE");
  //         io.to(message.room).emit("message", {
  //           user: user.name,
  //           text: message.text
  //         });

  //         //Creat message
  //         newMessage = new Message({ text: message.text, user: user });
  //         newMessage.save();

  //         //Add message to room
  //         Room.updateOne(
  //           { name: message.room },
  //           { $push: { messages: newMessage } }
  //         ).then(() => {
  //           console.log("Added message to db");
  //         });
  //       }
  //     });

  //     callback();
  //   });

  socket.on(
    "sendMoney",
    (room, amount, recieverIndex, giverIndex, callback) => {
      console.log("Send money request");

      //Want to find a way to remove this nesting
      Room.findOne({ name: room }).then(roomObject => {
        if (roomObject != null) {
          User.updateOne(
            { name: roomObject.users[recieverIndex].name },
            { cash: (roomObject.users[recieverIndex].cash += amount) }
          ).then(userUpdated => {
            User.updateOne(
              { name: roomObject.users[giverIndex].name },
              { cash: (roomObject.users[giverIndex].cash -= amount) }
            ).then(giver => {
              Room.updateOne({ name: room }, { users: roomObject.users }).then(
                updatedRoom => {
                  io.in(room).emit("users", roomObject.users);
                  console.log("Sent users to room");
                  io.to(room).emit("message", {
                    user: "Admin",
                    text: `${roomObject.users[recieverIndex].name} sent $${amount} to ${roomObject.users[giverIndex].name}`
                  });
                }
              );
            });
          });
        } else {
          console.log("Room does not exist");
        }
      });

      // console.log(getUsersInRoom(sendingUser.room));

      // TODO: Reimplement broadcast with mongo

      // socket.broadcast
      //   .in(sendingUser.room)
      //   .emit("users", { users: getUsersInRoom(sendingUser.room) });

      // console.log(sendingUser, reciever);
    }
  );
});

app.use(router);

server.listen(PORT, () => {
  console.log("Server has started");
});
