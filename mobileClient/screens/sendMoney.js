import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator
} from "react-native";

import UserPlate from "../components/userPlate.js";
import PrimaryButton from "../components/primaryButton";
import { CheckBox } from "react-native-elements";
import { TextField, OutlinedTextField } from "react-native-material-textfield";

export default function sendMoney({ navigation }) {
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
    return () => {
      navigation.navigate("sendMoney");
    };
  }, []);

  useEffect(() => {
    let usersChecked = 0;

    users.forEach(user => {
      if (user.checked) {
        usersChecked += 1;
      }
    });

    setTotalAmount(usersChecked * amount);
  }, [users]);

  const sendMoney = () => {
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
    <ScrollView style={{ backgroundColor: "white" }}>
      <UserPlate
        name={username}
        cash={cash}
        room={room}
        total={totalAmount}
        version="small"
      />

      <View style={styles.textfield}>
        <OutlinedTextField
          label="Amount per player"
          onChangeText={amount => {
            setAmount(amount);
            setError("");
          }}
          prefix="$"
          value={amount && amount}
          keyboardType="phone-pad"
        />
      </View>

      <CheckBox
        title="All"
        checked={checkedAll}
        onPress={() => checkAll()}
        checkedColor="rgb(52,186,241)"
        containerStyle={{ margin: 0 }}
      />
      {users.map(
        (user, index) =>
          index != myIndex && (
            <CheckBox
              title={`${user.name}: ${user.cash}`}
              checked={user.checked}
              onPress={() => checkUser(index)}
              checkedColor="rgb(52,186,241)"
              containerStyle={{ margin: 2 }}
            />
          )
      )}

      <View style={{ padding: 10 }}>
        <PrimaryButton
          text="Send money"
          onPress={() => {
            sendMoney();
          }}
        />
      </View>

      <Text>{error}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textfield: {
    padding: 10,
    marginBottom: 20
  }
});
