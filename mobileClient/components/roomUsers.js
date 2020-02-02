import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, IconToggle } from "react-native-material-ui";

export default roomUsers = ({ users, name, payUser }) => {
  return (
    <View style={styles.users}>
      <Text style={styles.usersTitle}>USERS</Text>
      {users.map(
        (user, index) =>
          user.name != name && (
            <View style={styles.listItem}>
              <View style={styles.leftListItem}>
                <IconToggle
                  name={user.type == "human" ? "person" : "computer"}
                />
                <Text>{user.name}</Text>
              </View>
              <Text>${user.cash}</Text>
            </View>
            // <ListItem
            //   key={user.name}
            //   divider
            //   centerElement={
            //     <View style={styles.centerElement}>
            //       <IconToggle
            //         name={user.type == "human" ? "person" : "computer"}
            //       />
            //       <Text>
            //         {user.name}: ${user.cash}
            //       </Text>
            //     </View>
            //   }
            //   // onPress={payUser}
            // />
          )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerElement: {
    flexDirection: "row",
    alignItems: "center"
  },
  users: {
    paddingTop: 20
  },
  usersTitle: {
    paddingLeft: 25,
    color: "#BBB4B4",
    fontSize: 14,
    fontWeight: "bold"
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#BBB4B4",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 10,
    paddingRight: 10
  },
  leftListItem: {
    flexDirection: "row",
    alignItems: "center"
  }
});
