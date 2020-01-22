import React, { useState, useEffect } from "react";

import queryString from "query-string";
import io from "socket.io-client";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [cash, setCash] = useState(0);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [myIndex, setMyIndex] = useState(0);
  const [myInfo, setMyInfo] = useState(null);

  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    const { name: nameString, room: roomString } = queryString.parse(
      location.search
    );

    socket = io(ENDPOINT);

    setName(nameString);
    setRoom(roomString);

    socket.emit("join", { nameString, roomString }, () => {
      console.log("Callback");
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    if (name != "" && users.length != 0) {
      users.map((u, index) => {
        if (name === u.name) {
          setCash(u.cash);
          setMyIndex(index);
        }
      });
    }
  }, [users, name]);

  useEffect(() => {
    socket.on("message", message => {
      console.log("Recieved Messages");
      setMessages([...messages, message]);
    });
  }, [messages]);

  useEffect(() => {
    socket.on("users", newUsers => {
      console.log("Recieved Users");
      setUsers(newUsers);
    });
  }, [users]);

  useEffect(() => {
    socket.on("messages", messageHistory => {
      console.log("Recieved message history");
      setMessages(messageHistory);
    });
  }, [messages]);

  const sendMessage = event => {
    console.log(message);
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", { text: message, room: room }, () =>
        setMessage("")
      );

      if (users.length > 1) {
        console.log("Trying to send money");

        socket.emit("sendMoney", room, 10, users[1].socket_id, () => {
          console.log("sent $10");
        });
      } else {
        console.log("Users empty");
      }
    }
  };

  const sendMoney = event => {
    socket.emit("sendMoney", room, 10, event.target.value, myIndex, () => {
      console.log("sent $10");
    });
  };

  return (
    <div>
      <h1>{`Room: ${room}`}</h1>
      <h1>{`Name: ${name}`}</h1>
      <ul>
        {users &&
          users.map((user, index) => (
            <div>
              <li>{`${user.name} - ${user.cash}`}</li>
              <button value={index} onClick={sendMoney}>
                Send $10
              </button>
            </div>
          ))}
      </ul>
      {messages &&
        messages.map(({ user, text }) => <p>{`${user}: ${text}`}</p>)}
      <input
        value={message}
        onChange={event => setMessage(event.target.value)}
        onKeyPress={event => {
          event.key === "Enter" && sendMessage(event);
        }}
      />

      <h1>{`Money: ${cash}`}</h1>
    </div>
  );
};

export default Chat;
