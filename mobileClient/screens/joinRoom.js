import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Button } from "react-native-material-ui";
import io from "socket.io-client";
import PrimaryButton from "../components/primaryButton";
import {
  TextField,
  FilledTextField,
  OutlinedTextField
} from "react-native-material-textfield";

let socket;

const ENDPOINT = "http://192.168.1.101:5000/";
//const ENDPOINT = "https://nochash-backend.herokuapp.com/";

export default function JoinRoom({ navigation }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    socket = io(ENDPOINT);
  }, []);

  return (
    <View style={{ padding: 10 }}>
      <TextField
        label="Your Name"
        onChangeText={text => setName(text)}
        value={name}
      />
      <TextField
        label="Room Name"
        onChangeText={text => {
          setRoom(text);
          setError("");
        }}
        value={room}
      />

      <PrimaryButton
        text="Join Room"
        onPress={() => {
          socket.emit("roomExists", { room }, roomExists => {
            if (roomExists) {
              navigation.navigate("Room", { name, room });
            } else {
              setError("Room doesn't exist");
            }
          });
        }}
      />
      <Text>{error}</Text>
    </View>
  );
}
