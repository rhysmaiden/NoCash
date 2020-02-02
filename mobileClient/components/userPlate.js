import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

//TODO: Refactor Large and small into one contained class

export default userPlate = ({ cash, room, version, total }) => {
  return (
    <View>
      {version == "large" ? (
        <View style={largeStyles.plate}>
          <Text style={largeStyles.roomName}>{room}</Text>
          <View style={largeStyles.circle}>
            {cash == 0 ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <View>
                <Text style={largeStyles.money}>${cash}</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={smallStyles.plate}>
          <View style={smallStyles.circle}>
            <Text style={smallStyles.money}>${cash}</Text>
            <Text style={smallStyles.username}>{name}</Text>
          </View>
          <View>
            <Text>{total}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const largeStyles = StyleSheet.create({
  plate: {
    alignItems: "center",
    justifyContent: "space-evenly",
    textAlign: "center",
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    backgroundColor: "rgb(52,186,241)",
    height: 300
  },
  circle: {
    borderRadius: 100,

    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    height: 160,
    width: 160
  },
  money: {
    textAlign: "center",
    fontSize: 55,
    color: "#1986B2"
  },
  username: {
    textAlign: "center",
    fontSize: 15,
    color: "white"
  },
  roomName: {
    fontSize: 48,
    color: "white"
  }
});

const smallStyles = StyleSheet.create({
  plate: {
    flexDirection: "row",
    justifyContent: "space-evenly",

    backgroundColor: "white",
    padding: 20,

    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    borderRadius: 50,
    backgroundColor: "rgb(52,186,241)"
  },
  circle: {
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 5,

    justifyContent: "center",
    height: 100,
    width: 100
  },
  money: {
    textAlign: "center",
    fontSize: 20,
    color: "white"
  },
  username: {
    textAlign: "center",
    fontSize: 12,
    color: "white"
  }
});
