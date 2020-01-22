import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Button } from "react-native-material-ui";
import {
  TextField,
  FilledTextField,
  OutlinedTextField
} from "react-native-material-textfield";

export default function JoinRoom({ navigation }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <View style={{ padding: 10 }}>
      <TextField
        label="Your Name"
        onChangeText={text => setName(text)}
        value={name}
      />
      <TextField
        label="Room Name"
        onChangeText={text => setRoom(text)}
        value={room}
      />

      <Button
        style={{ margin: 30 }}
        raised
        primary
        text="Join"
        onPress={() => {
          //Verify that this exists
          navigation.navigate("Room", { name, room });
        }}
      />
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
