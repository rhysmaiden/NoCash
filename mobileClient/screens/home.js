import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Navigator from "../routes/homeStack";

export default function Home({ navigation }) {
  return (
    <View>
      <Button
        title="Join"
        onPress={() => {
          navigation.navigate("JoinRoom");
        }}
      />
      <Button
        title="Create"
        onPress={() => {
          navigation.navigate("GameSetup");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
