import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-material-ui";

import {
  TextField,
  FilledTextField,
  OutlinedTextField
} from "react-native-material-textfield";

export default function Pay({ navigation }) {
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState({});
  const [availableFunds, setAvailableFunds] = useState(0);
  const [amount, setAmount] = useState(null);
  const [myIndex, setMyIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setIndex(navigation.getParam("index"));
    setMyIndex(navigation.getParam("myIndex"));
    setUser(navigation.getParam("user"));
    setAvailableFunds(navigation.getParam("cash"));

    console.log(navigation.getParam("index"));
  }, []);

  const sendMoney = () => {
    const socket = navigation.getParam("socket");
    const room = navigation.getParam("room");

    if (amount > availableFunds) {
      setError("You don't have the funds");
    } else if (amount < 0) {
      setError("Sneaky sneaky");
    } else {
      socket.emit("sendMoney", room, amount, index, myIndex, () => {
        navigation.pop();
      });
    }
  };

  const requestMoney = () => {
    const socket = navigation.getParam("socket");
    const room = navigation.getParam("room");

    if (amount < 0) {
      setError("You can't request negative money");
    } else {
      socket.emit("requestMoney", room, amount, index, myIndex, () => {
        navigation.pop();
      });
    }
  };
  //TODO: RUn loading animation on button click and tick before going back

  return (
    <View style={{ padding: 10 }}>
      <Text>{user.name}</Text>
      <Text>{user.cash}</Text>
      <TextField
        label="Amount"
        onChangeText={amount => setAmount(amount)}
        prefix="$"
        value={amount && amount}
        keyboardType="phone-pad"
      />
      <Button
        style={{ margin: 30 }}
        raised
        primary
        text="Send money"
        onPress={sendMoney}
      />
      <Button
        style={{ margin: 30 }}
        raised
        primary
        text="Request money"
        onPress={requestMoney}
      />
      <Text>{error}</Text>
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
