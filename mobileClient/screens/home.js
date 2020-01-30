import React from "react";
import { View } from "react-native";
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
