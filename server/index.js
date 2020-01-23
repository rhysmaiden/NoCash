const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { mongoose } = require("./connection.js");
const { Room, Message, User } = require("./models/models.js");
const ip = require("ip");
console.log(ip.address());

//TODO: Reconnect when lost connection

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

      name = name.trim();

      console.log("Room name", room);

      socket.join(room);

      //Get or Create Room
      await Room.findOne({ name: room }).then(roomRecord => {
        if (!roomRecord) {
          callback("Room doesn't exist");
        } else {
          currentRoom = roomRecord;
        }
      });

      await User.findOne({ name: name }).then(async record => {
        //Create new user
        if (record === null) {
          var newUser = new User({
            name: name,
            cash: currentRoom.playerAmount,
            socket_id: socket.id,
            type: "human"
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

  socket.on(
    "createRoom",
    async ({ room: roomName, playerAmount, computerPlayers }, callback) => {
      console.log(roomName, playerAmount, computerPlayers);

      Room.find({ name: roomName })
        .count()
        .then(async count => {
          if (count > 0) {
            console.log("Already exists");
            callback("Room already exists");
          } else {
            var bots = [];
            roomObject = new Room({
              name: roomName,
              playerAmount: playerAmount
            });

            await computerPlayers.map(computerPlayer => {
              var botObject = new User({
                name: computerPlayer.name,
                cash: computerPlayer.amount,
                type: "bot"
              });
              botObject.save().then(bot => {
                roomObject.users.push(bot);

                //The roomObject was being saved before the users had to been added due to it being asynchronous
                if (roomObject.users.length === computerPlayers.length) {
                  roomObject.save().then(p => {
                    console.log("New room created: ", roomName);
                    callback("Room created");
                  });
                }
              });
            });
          }
        });
    }
  );

  socket.on("roomExists", async ({ room: roomName }, callback) => {
    Room.find({ name: roomName })
      .count()
      .then(count => {
        if (count > 0) {
          callback(true);
        } else {
          callback(false);
        }
      });
  });

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

      var amountInt = parseInt(amount);

      //Just in case someone tries to take money from opponent
      if (amountInt > 0) {
        console.log("Positive");
        //Want to find a way to remove this nesting
        Room.findOne({ name: room }).then(roomObject => {
          if (roomObject != null) {
            User.updateOne(
              //Add money from reciever
              { name: roomObject.users[recieverIndex].name },
              { cash: (roomObject.users[recieverIndex].cash += amountInt) }
            ).then(userUpdated => {
              User.updateOne(
                //Remove money from sender
                { name: roomObject.users[giverIndex].name },
                { cash: (roomObject.users[giverIndex].cash -= amountInt) }
              ).then(giver => {
                //Update room with updates users
                Room.updateOne(
                  { name: room },
                  { users: roomObject.users }
                ).then(updatedRoom => {
                  console.log(roomObject.users);
                  io.in(room).emit("users", roomObject.users);
                  console.log("Sent users to room");
                  io.to(room).emit("message", {
                    user: "Admin",
                    text: `${roomObject.users[recieverIndex].name} sent $${amount} to ${roomObject.users[giverIndex].name}`
                  });
                  callback();
                });
              });
            });
          } else {
            console.log("Room does not exist");
          }
        });
      } else {
        console.log("Negative amount");
        callback("Negative");
      }
    }
  );

  const requestBotMoney = (
    roomObject,
    room,
    amountInt,
    recieverIndex,
    giverIndex,
    callback
  ) => {
    console.log("Requesting bot money");
    User.updateOne(
      //Add money from reciever
      { name: roomObject.users[recieverIndex].name },
      { cash: (roomObject.users[recieverIndex].cash -= amountInt) }
    ).then(userUpdated => {
      User.updateOne(
        //Remove money from sender
        { name: roomObject.users[giverIndex].name },
        { cash: (roomObject.users[giverIndex].cash += amountInt) }
      ).then(giver => {
        //Update room with updates users
        Room.updateOne({ name: room }, { users: roomObject.users }).then(
          updatedRoom => {
            io.in(room).emit("users", roomObject.users);
            console.log("Sent users to room");
            io.to(room).emit("message", {
              user: "Admin",
              text: `${roomObject.users[recieverIndex].name} request $${amountInt} from ${roomObject.users[giverIndex].name}`
            });
            callback();
          }
        );
      });
    });
  };

  socket.on(
    "requestMoney",
    (room, amount, recieverIndex, giverIndex, callback) => {
      console.log("Request");

      var amountInt = parseInt(amount);

      if (amountInt > 0) {
        Room.findOne({ name: room }).then(roomObject => {
          if (roomObject != null) {
            User.findOne({ name: roomObject.users[recieverIndex].name }).then(
              recievingUser => {
                if (recievingUser.type == "bot") {
                  requestBotMoney(
                    roomObject,
                    room,
                    amountInt,
                    recieverIndex,
                    giverIndex,
                    callback
                  );
                } else {
                  io.to(`${recievingUser.socket_id}`).emit("moneyRequest", {
                    requestingUser: giverIndex,
                    amount: amountInt
                  });
                }
              }
            );
          }
        });
      } else {
        callback("Negative amount");
      }
    }
  );
});

app.use(router);

server.listen(PORT, () => {
  console.log("Server has started");
});
