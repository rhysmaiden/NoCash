import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PrimaryButton from "../components/primaryButton";

export default function Home({ navigation }) {
  return (
    <View style={styles.background}>
      <View style={styles.logo}>
        <Text style={styles.title}>NO CASH</Text>

        <View style={styles.circle}>
          <Text style={styles.symbol}>$</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <PrimaryButton
          text="Join Room"
          onPress={() => {
            navigation.navigate("JoinRoom");
          }}
        />
        <PrimaryButton
          type="inverse"
          text="Create Room"
          onPress={() => {
            navigation.navigate("CreateRoom");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#34BAF1",
    padding: 20,
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  title: {
    color: "white",
    fontSize: 48,
    textAlign: "center",
    marginBottom: 20
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "white",
    textAlign: "center",
    justifyContent: "center"
  },
  symbol: {
    color: "#92D7FD",
    textAlign: "center",
    fontSize: 48,
    fontWeight: "bold"
  },
  logo: {
    alignItems: "center"
  },
  buttons: {
    width: "100%"
  }
});
