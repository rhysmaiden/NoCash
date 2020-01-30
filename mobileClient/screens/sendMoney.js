import React, { useState, useEffect } from "react";

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
import { CheckBox } from "react-native-elements";

import {
  TextField,
  FilledTextField,
  OutlinedTextField
} from "react-native-material-textfield";

const sendMoney = ({ navigation }) => {
  const myIndex = navigation.getParam("myIndex");

  const room = navigation.getParam("room");
  const socket = navigation.getParam("socket");
  const username = navigation.getParam("users")[myIndex].name;
  const cash = navigation.getParam("users")[myIndex].cash;

  const [error, setError] = useState("");
  const [amount, setAmount] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const users = navigation.getParam("users");

    users.forEach(user => {
      user.checked = false;
    });

    setUsers(users);
  }, []);

  const sendMoney = () => {
    if (amount > cash) {
      setError("You don't have the funds");
    } else if (amount < 0) {
      setError("Sneaky sneaky");
    } else {
      const ids = [];
      users.map(user => {
        user.checked && ids.push(user._id);
      });
      console.log(ids);
      //   socket.emit("sendMoney", room, amount, ids, myIndex, () => {
      //     navigation.pop();
      //   });
    }
  };

  const checkUser = index => {
    const tempUsers = [...users];
    tempUsers[index].checked = !tempUsers[index].checked;
    setUsers(tempUsers);
  };

  return (
    <ScrollView style={{}}>
      <UserPlate name={username} cash={cash} room={room} version="small" />
      {/* <CheckBox
          title="All"
          checked={user.checked}
          onPress={() => checkUser(index)}
          checkedColor="rgb(52,186,241)"
        /> */}
      {users.map(
        (user, index) =>
          index != myIndex && (
            <CheckBox
              title={`${user.name}: ${user.cash}`}
              checked={user.checked}
              onPress={() => checkUser(index)}
              checkedColor="rgb(52,186,241)"
            />
          )
      )}

      <View style={{ padding: 10, backgroundColor: "white" }}>
        <TextField
          label="Amount"
          onChangeText={amount => {
            setAmount(amount);
            setError("");
          }}
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

        <Text>{error}</Text>
      </View>
    </ScrollView>
  );
};

export default sendMoney;
