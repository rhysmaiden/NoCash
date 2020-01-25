import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  ActivityIndicator,
  Button
} from "react-native";
import io from "socket.io-client";
import UserPlate from "../components/userPlate.js";
import RoomUsers from "../components/roomUsers.js";
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton,
  DialogTitle
} from "react-native-popup-dialog";

import {
  ListItem,
  Card,
  DialogDefaultActions,
  Snackbar
} from "react-native-material-ui";

let socket;

export default function Room({ navigation }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [cash, setCash] = useState(0);
  const [myIndex, setMyIndex] = useState(0);
  const [myInfo, setMyInfo] = useState(null);
  const [popup, setPopup] = useState(false);
  const [request, setRequest] = useState(null);
  const [snackBarVisible, setSnackBarVisibile] = useState(false);

  const ENDPOINT = "http://192.168.1.101:5000/";

  useEffect(() => {
    const nameString = navigation.getParam("name");
    const roomString = navigation.getParam("room");
    setName(nameString);
    setRoom(roomString);
    socket = io(ENDPOINT);

    socket.emit("join", { nameString, roomString }, info => {
      console.log(info);
    });

    return () => {
      socket.emit("close", callback => {
        console.log("Disconnect");
      });

      console.log("DISCONESSISO");

      socket.off();
    };
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("users", newUsers => {
      setUsers(newUsers);
    });
  }, [users]);

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
        console.log("Sent reqquest money");
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
    <ScrollView>
      <UserPlate name={name} cash={cash} room={room} version="large" />
      <RoomUsers users={users} name={name} payUser={payUser} />

      {popup && (
        <Dialog
          footer={
            <DialogFooter>
              <DialogButton text="DECLINE" onPress={() => setPopup(false)} />
              <DialogButton
                text="ACCEPT"
                onPress={() => {
                  console.log(popup);
                  acceptRequest();
                  setPopup(false);
                }}
              />
            </DialogFooter>
          }
          dialogTitle={<DialogTitle title="Money Request" />}
          visible={popup}
          onTouchOutside={() => {}}
        >
          <DialogContent
            style={{
              margin: 10
            }}
          >
            {popup && (
              <Text>
                {`${users[request.requestingUser].name} is requesting $${
                  request.amount
                } from you.`}
              </Text>
            )}
          </DialogContent>
        </Dialog>
      )}
      {snackBarVisible && (
        <View
          style={{
            bottom: 15,
            position: "absolute",
            width: "100%",
            backgroundColor: "red"
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
      )}
    </ScrollView>
  );
}
