import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import io from "socket.io-client";

import {
  ListItem,
  Card,
  Dialog,
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
    console.log("Is this running?");
    const nameString = navigation.getParam("name");
    const roomString = navigation.getParam("room");
    setName(nameString);
    setRoom(roomString);

    console.log(ENDPOINT);

    socket = io(ENDPOINT);

    console.log(nameString);
    console.log(roomString);
    socket.emit("join", { nameString, roomString }, info => {
      console.log(info);
    });

    console.log("we got to here");
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("users", newUsers => {
      console.log("Recieved Users");
      setUsers(newUsers);
      setSnackBarVisibile(true);
    });
  }, [users]);

  useEffect(() => {
    socket.on("moneyRequest", request => {
      console.log("Rreuqest");
      console.log(request);
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

  return (
    <ScrollView style={{ flex: 1 }}>
      <Card>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {`${name} - $${cash}`}
          </Text>
        </View>
      </Card>

      {users.map(
        (user, index) =>
          user.name != name && (
            <ListItem
              divider
              centerElement={{
                primaryText: `${user.name}`,
                secondaryText: `$${user.cash}`
              }}
              onPress={() => {
                navigation.navigate("Pay", {
                  user,
                  index,
                  myIndex,
                  socket,
                  room,
                  cash
                });
                //sendMoney(index);
              }}
            />
          )
      )}

      {popup && (
        <Dialog>
          <Dialog.Title>
            <Text>Money Request</Text>
          </Dialog.Title>
          <Dialog.Content>
            <Text>{`${users[request.requestingUser].name} is requesting $${
              request.amount
            } from you.`}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <DialogDefaultActions
              actions={["decline", "accept"]}
              onActionPress={optionClicked => {
                if (optionClicked == "accept") {
                  acceptRequest();
                } else {
                  declineRequest();
                }
                console.log(optionClicked);
                setPopup(false);
              }}
            />
          </Dialog.Actions>
        </Dialog>
      )}
      <View style={{ bottom: 0, position: "absolute", width: "100%" }}>
        <Snackbar
          visible={snackBarVisible}
          message={messages.length > 0 && messages.slice(-1)[0].text}
          onRequestClose={() => setSnackBarVisibile(false)}
          onPress={() => {
            console.log("FIished");
            setSnackBarVisibile(false);
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
