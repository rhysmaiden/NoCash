import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { TextField } from "react-native-material-textfield";
import io from "socket.io-client";

let socket;

// const ENDPOINT = "http://192.168.1.101:5000/";
const ENDPOINT = "https://nochash-backend.herokuapp.com/";

import { Button } from "react-native-material-ui";

export default function CreateRoom({ navigation }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [playerAmount, setPlayerAmount] = useState(null);
  const [computerPlayers, setAI] = useState([]);
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

      <TextField
        label="Starting player amount"
        onChangeText={amount => setPlayerAmount(amount)}
        prefix="$"
        value={playerAmount && playerAmount}
        keyboardType="phone-pad"
      />

      {computerPlayers.map((computerPlayer, index) => (
        <View>
          <TextField
            label={`AI (${index + 1}) Name`}
            onChangeText={text => {
              computerPlayers[index].name = text;
              setAI(computerPlayers);
            }}
            value={computerPlayer.name}
            style={{ height: 20 }}
          />
          <TextField
            label={`AI (${index + 1}) Amount`}
            onChangeText={amount => {
              computerPlayers[index].amount = amount;
              setAI(computerPlayers);
            }}
            prefix="$"
            value={computerPlayer.amount && computerPlayer.amount}
            keyboardType="phone-pad"
            style={{ height: 20 }}
          />
        </View>
      ))}

      <Button
        style={{ margin: 30 }}
        raised
        text="Add AI"
        onPress={() => {
          setAI([...computerPlayers, { name: "", amount: null }]);
        }}
      />

      <Button
        style={{ margin: 30 }}
        raised
        primary
        text="Create Room"
        onPress={() => {
          socket.emit(
            "createRoom",
            { room, playerAmount, computerPlayers },
            response => {
              if (response == "Room already exists") {
                setError(response);
              } else {
                console.log("Success");
                navigation.navigate("Room", { name, room });
              }
            }
          );
        }}
      />

      <Text>{error}</Text>
    </View>
  );
}
