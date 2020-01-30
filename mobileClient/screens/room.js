import React, { useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import io from "socket.io-client";
import UserPlate from "../components/userPlate.js";
import RoomUsers from "../components/roomUsers.js";
import Popup from "../components/popup.js";
import { Snackbar } from "react-native-material-ui";
import PrimaryButton from "../components/primaryButton.js";

let socket;

export default function Room({ navigation }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [cash, setCash] = useState(0);
  const [myIndex, setMyIndex] = useState(0);
  const [popup, setPopup] = useState(false);
  const [request, setRequest] = useState(null);
  const [snackBarVisible, setSnackBarVisibile] = useState(false);

  //const ENDPOINT = "http://192.168.1.101:5000/";
  const ENDPOINT = "https://nochash-backend.herokuapp.com/";

  useEffect(() => {
    const nameString = navigation.getParam("name");
    const roomString = navigation.getParam("room");
    setName(nameString);
    setRoom(roomString);
    socket = io(ENDPOINT);

    socket.emit("join", { nameString, roomString }, info => {
      console.log("Joined room");
    });

    return () => {
      socket.emit("close", callback => {
        console.log("Disconnect");
      });

      socket.off();
    };
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("users", newUsers => {
      setUsers(newUsers);
    });
  }, [users]);

  //Always be able to recueve messages and money requesrs
  useEffect(() => {
    socket.on("moneyRequest", request => {
      setRequest(request);
      setPopup(true);
    });

    socket.on("message", message => {
      setSnackBarVisibile(true);
      setMessages([...messages, message]);
    });
  }, []);

  //Makes sure that the users name and the users in room have been received from server
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

  const acceptRequest = () => {
    socket.emit(
      "sendMoney",
      room,
      request.amount,
      request.requestingUser,
      myIndex,
      () => {
        console.log("Accept request");
      }
    );
  };

  const payUser = index => {
    navigation.navigate("Pay", {
      user: users[index],
      name,
      index,
      myIndex,
      socket,
      room,
      cash
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <UserPlate name={name} cash={cash} room={room} version="large" />
        <PrimaryButton
          text="Send Money"
          onPress={() => {
            console.log("Pressed");
            navigation.navigate("SendMoney", { myIndex, users, room, socket });
          }}
        />
        <RoomUsers users={users} name={name} payUser={payUser} />

        <View>
          <Popup
            title="Money Request"
            message={`${popup &&
              users[request.requestingUser].name} is requesting $${popup &&
              request.amount} from you.`}
            options={["Decline", "Accept"]}
            onSelectOption={index => {
              if (index == 1) {
                acceptRequest();
              }

              setPopup(false);
            }}
            popup={popup}
          />
        </View>
      </ScrollView>

      <View
        style={{
          bottom: 15,
          position: "absolute",
          width: "100%"
        }}
      >
        <Snackbar
          visible={snackBarVisible}
          message={messages.length > 0 && messages.slice(-1)[0].text}
          onRequestClose={() => setSnackBarVisibile(false)}
          onPress={() => {
            setSnackBarVisibile(false);
          }}
        />
      </View>
    </View>
  );
}
