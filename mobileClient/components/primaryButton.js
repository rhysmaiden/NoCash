import React from "react";
import { Button } from "react-native-material-ui";
import { StyleSheet } from "react-native";

const PrimaryButton = props => {
  return (
    props.text && (
      <Button
        primary
        text={props.text}
        onPress={props.onPress}
        style={{
          container: {
            margin: 0,
            marginTop: 10,
            marginBottom: 10,
            backgroundColor:
              props.type == "inverse" ? "white" : "rgb(52,186,241)",
            borderColor: props.type == "inverse" ? "rgb(52,186,241)" : "white",
            borderWidth: 1,
            borderRadius: 20,
            width: props.width && Number(props.width)
          },
          text: {
            color: props.type == "inverse" ? "rgb(52,186,241)" : "white"
          }
        }}
      />
    )
  );
};

export default PrimaryButton;
