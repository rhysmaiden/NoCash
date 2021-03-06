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
import PageHeader from "../components/pageHeader.js";
import BackButton from "../components/backButton.js";

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
  }, [users, amount]);

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
    <ScrollView
      style={{
        backgroundColor: "white",
        padding: 20
      }}
    >
      <BackButton
        clicked={() => {
          navigation.goBack();
        }}
      />
      <PageHeader
        title="Send Money"
        description="Select the users and the amount that you would like to send"
      />
      <Text style={styles.balance}>Balance: ${cash}</Text>

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

      <View style={styles.checkList}>
        <View style={styles.userRow}>
          <View style={styles.leftRow}>
            <CheckBox
              checked={checkedAll}
              onPress={() => checkAll()}
              checkedColor="rgb(52,186,241)"
              containerStyle={styles.checkBoxContainer}
            />
            <Text>All</Text>
          </View>
        </View>

        {users.map(
          (user, index) =>
            index != myIndex && (
              <View style={styles.userRow}>
                <View style={styles.leftRow}>
                  <CheckBox
                    checked={user.checked}
                    onPress={() => checkUser(index)}
                    checkedColor="rgb(52,186,241)"
                    containerStyle={styles.checkBoxContainer}
                  />
                  <Text>{user.name}</Text>
                </View>
                <Text>${user.cash}</Text>
              </View>
            )
        )}
      </View>

      <Text style={styles.total}>Total: ${totalAmount}</Text>

      <View style={{ marginBottom: 80 }}>
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
    marginTop: 20,
    marginBottom: 20
  },
  balance: {
    fontSize: 18,
    fontWeight: "bold"
  },
  total: {
    fontSize: 24,
    marginBottom: 20
  },
  checkBoxContainer: {
    backgroundColor: "white",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingLeft: 0
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#BBB4B4"
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  checkList: {
    marginBottom: 40
  }
});
