import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Button } from "react-native-material-ui";
import io from "socket.io-client";
import PrimaryButton from "../components/primaryButton";
import { TextField } from "react-native-material-textfield";
import PageHeader from "../components/pageHeader.js";
import BackButton from "../components/backButton.js";

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
    <View style={styles.page}>
      <BackButton
        clicked={() => {
          navigation.goBack();
        }}
      />
      <PageHeader
        title="Join Room"
        description="Choose a name for yourself and connect to an existing room"
      />
      <View style={styles.form}>
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
        {error != "" && <Text style={styles.error}>Error: {error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "white",
    flex: 1
  },
  form: {
    justifyContent: "space-evenly"
  },
  error: {
    color: "red"
  }
});
