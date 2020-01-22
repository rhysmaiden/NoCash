import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import io from "socket.io-client";

import { ListItem, Card } from "react-native-material-ui";

let socket;

export default function Room({ navigation }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [cash, setCash] = useState(0);
  const [myIndex, setMyIndex] = useState(0);
  const [myInfo, setMyInfo] = useState(null);

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
    socket.emit("join", { nameString, roomString }, () => {
      console.log("Callback");
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
    });
  }, [users]);

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

  return (
    <View>
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
    </View>
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
