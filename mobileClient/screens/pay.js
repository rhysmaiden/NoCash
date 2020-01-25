import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Button, ListItem, IconToggle } from "react-native-material-ui";
import UserPlate from "../components/userPlate.js";
import PrimaryButton from "../components/primaryButton";

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
    <ScrollView style={{}}>
      <UserPlate
        name={navigation.getParam("name")}
        cash={navigation.getParam("cash")}
        room={""}
        version="small"
      />
      <ListItem
        divider
        centerElement={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconToggle name={user.type == "human" ? "person" : "computer"} />
            <Text>
              {user.name}: ${user.cash}
            </Text>
          </View>
        }
        onPress={() => {}}
      />
      <View style={{ padding: 10, backgroundColor: "white" }}>
        <TextField
          label="Amount"
          onChangeText={amount => setAmount(amount)}
          prefix="$"
          value={amount && amount}
          keyboardType="phone-pad"
        />
        <PrimaryButton
          text="Send money"
          onPress={() => {
            sendMoney();
          }}
        />
        <PrimaryButton
          text="Request money"
          onPress={() => {
            requestMoney();
          }}
        />

        <Text>{error}</Text>
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
