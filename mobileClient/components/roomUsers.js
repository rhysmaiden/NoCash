import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, IconToggle } from "react-native-material-ui";

export default roomUsers = ({ users, name, payUser }) => {
  return (
    <View>
      {users.map(
        (user, index) =>
          user.name != name && (
            <ListItem
              key={user.name}
              divider
              centerElement={
                <View style={styles.centerElement}>
                  <IconToggle
                    name={user.type == "human" ? "person" : "computer"}
                  />
                  <Text>
                    {user.name}: ${user.cash}
                  </Text>
                </View>
              }
              onPress={payUser}
            />
          )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerElement: {
    flexDirection: "row",
    alignItems: "center"
  }
});
