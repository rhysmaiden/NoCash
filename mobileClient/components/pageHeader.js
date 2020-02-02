import React from "react";
import { StyleSheet, Button, View, Text } from "react-native";

const pageHeader = ({ title, description }) => {
  return (
    <View style={styles.header}>
      <Button title="<-" style={{ container: { color: "grey" } }} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 230,
    justifyContent: "space-evenly",
    alignItems: "flex-start"
  },
  title: {
    fontSize: 48,
    marginBottom: 10
  }
});

export default pageHeader;
