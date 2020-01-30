import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

//TODO: Refactor Large and small into one contained class

export default userPlate = ({ cash, name, version }) => {
  return (
    <View style={{ padding: 10 }}>
      {version == "large" ? (
        <View style={largeStyles.plate}>
          <View style={largeStyles.circle}>
            {cash == 0 ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <View>
                <Text style={largeStyles.money}>${cash}</Text>
                <Text style={largeStyles.username}>{name}</Text>
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
        </View>
      )}
    </View>
  );
};

const largeStyles = StyleSheet.create({
  plate: {
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    backgroundColor: "rgb(52,186,241)",
    borderRadius: 50
  },
  circle: {
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 5,
    justifyContent: "center",
    height: 200,
    width: 200
  },
  money: {
    textAlign: "center",
    fontSize: 40,
    color: "white"
  },
  username: {
    textAlign: "center",
    fontSize: 15,
    color: "white"
  }
});

const smallStyles = StyleSheet.create({
  plate: {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "center",
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
