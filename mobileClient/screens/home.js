import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Navigator from "../routes/homeStack";
import { Button } from "react-native-material-ui";
import PrimaryButton from "../components/primaryButton";

export default function Home({ navigation }) {
  return (
    <View style={{ padding: 10 }}>
      <PrimaryButton
        text="Join Room"
        onPress={() => {
          navigation.navigate("JoinRoom");
        }}
      />
      <PrimaryButton
        text="Create Room"
        onPress={() => {
          navigation.navigate("CreateRoom");
        }}
      />
    </View>
  );
}
