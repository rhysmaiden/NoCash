import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button, ListItem, Icon, IconToggle } from "react-native-material-ui";

import {
  TextField,
  FilledTextField,
  OutlinedTextField
} from "react-native-material-textfield";

export default roomUsers = props => {
  useEffect(() => {}, []);

  return (
    <View>
      {props.users.map(
        (user, index) =>
          user.name != props.name && (
            <ListItem
              key={user.name}
              divider
              centerElement={
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <IconToggle
                    name={user.type == "human" ? "person" : "computer"}
                  />
                  <Text>
                    {user.name}: ${user.cash}
                  </Text>
                </View>
              }
              rightElement={<IconToggle name="forward" />}
              onPress={() => {
                console.log("Pressed");
                props.payUser(index);
              }}
            />
          )
      )}
    </View>
  );
};
