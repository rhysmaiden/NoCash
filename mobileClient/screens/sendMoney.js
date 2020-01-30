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
  const giverId = navigation.getParam("users")[myIndex]._id;

  const [error, setError] = useState("");
  const [amount, setAmount] = useState(null);
  const [users, setUsers] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const users = navigation.getParam("users");

    users.forEach(user => {
      user.checked = false;
    });

    setUsers(users);
  }, []);

  useEffect(() => {
    let usersChecked = 0;

    users.forEach(user => {
      if (user.checked) {
        usersChecked += 1;
      }
    });

    console.log(amount);

    console.log(usersChecked * amount);

    setTotalAmount(usersChecked * amount);
  }, [users]);

  const sendMoney = () => {
    console.log(totalAmount);
    //TODO: The amount needs to multiply by number of users to send to
    if (totalAmount > cash) {
      setError("You don't have the funds");
    } else if (totalAmount < 0) {
      setError("Sneaky sneaky");
    } else {
      const recieverIndexes = [];
      users.map((user, index) => {
        user.checked && recieverIndexes.push(index);
      });

      socket.emit("sendMoney", room, amount, recieverIndexes, myIndex, () => {
        navigation.pop();
      });
    }
  };

  const checkUser = index => {
    const tempUsers = [...users];
    tempUsers[index].checked = !tempUsers[index].checked;
    setUsers(tempUsers);
  };

  const checkAll = () => {
    const tempUsers = [...users];
    tempUsers.map(tempUser => {
      tempUser.checked = !checkedAll;
    });
    setUsers(tempUsers);
    setCheckedAll(!checkedAll);
  };

  //TODO: Bots at the top

  return (
    <ScrollView style={{}}>
      <UserPlate name={username} cash={cash} room={room} version="small" />
      <CheckBox
        title="All"
        checked={checkedAll}
        onPress={() => checkAll()}
        checkedColor="rgb(52,186,241)"
      />
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
