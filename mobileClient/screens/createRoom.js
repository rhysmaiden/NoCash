import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { TextField } from "react-native-material-textfield";
import io from "socket.io-client";
import PageHeader from "../components/pageHeader.js";
import PrimaryButton from "../components/primaryButton.js";
import BackButton from "../components/backButton.js";

let socket;

const ENDPOINT = "http://192.168.1.101:5000/";
//const ENDPOINT = "https://nochash-backend.herokuapp.com/";

export default function CreateRoom({ navigation }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [playerAmount, setPlayerAmount] = useState(null);
  const [computerPlayers, setAI] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    socket = io(ENDPOINT);
  }, []);

  const createRoom = () => {
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
  };

  return (
    <ScrollView style={styles.page}>
      <BackButton
        clicked={() => {
          navigation.goBack();
        }}
      />
      <PageHeader
        title="Create Room"
        description="Setup a new room for you and your friends"
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

        <TextField
          label="Starting player cash"
          onChangeText={amount => setPlayerAmount(amount)}
          prefix="$"
          value={playerAmount && playerAmount}
          keyboardType="phone-pad"
        />

        {computerPlayers.length > 0 && (
          <Text style={styles.banksTitle}>Banks</Text>
        )}

        {computerPlayers.map((computerPlayer, index) => (
          <View>
            <TextField
              label={`Bank (${index + 1}) Name`}
              onChangeText={text => {
                computerPlayers[index].name = text;
                setAI(computerPlayers);
              }}
              value={computerPlayer.name}
              style={styles.textField}
            />
            <TextField
              label={`Bank (${index + 1}) Amount`}
              onChangeText={amount => {
                computerPlayers[index].amount = amount;
                setAI(computerPlayers);
              }}
              prefix="$"
              value={computerPlayer.amount && computerPlayer.amount}
              keyboardType="phone-pad"
              style={styles.textField}
            />
          </View>
        ))}

        <View style={styles.instruction}>
          <Text>
            Add additional banks to hold cash for the game you are playing.
          </Text>
          <Text style={{ color: "grey" }}>e.g. Monopoly bank</Text>
        </View>

        <View style={styles.buttons}>
          <PrimaryButton
            text="Add Bank"
            type="inverse"
            onPress={() => {
              setAI([...computerPlayers, { name: "", amount: null }]);
            }}
          />
          <PrimaryButton text="Create Room" onPress={createRoom} />
          {error != "" && <Text style={styles.error}>Error: {error}</Text>}
        </View>
      </View>
    </ScrollView>
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
  },
  instruction: {
    marginTop: 20,
    marginBottom: 20
  },
  banksTitle: {
    marginTop: 20,
    fontWeight: "bold"
  },
  buttons: {
    marginBottom: 80
  },
  textField: {
    height: 20
  }
});
