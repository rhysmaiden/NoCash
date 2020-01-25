import React from "react";
import { Button } from "react-native-material-ui";

const PrimaryButton = props => {
  return (
    props.text && (
      <Button
        raised
        primary
        text={props.text}
        onPress={props.onPress}
        style={{
          container: {
            margin: 0,
            marginTop: 20,
            backgroundColor: "rgb(52,186,241)",
            borderRadius: 20
          }
        }}
      />
    )
  );
};

export default PrimaryButton;
