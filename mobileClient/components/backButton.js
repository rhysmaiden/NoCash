import React from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const backButton = ({ clicked, buttonColor, backdropColor }) => {
  return (
    <View
      style={{
        paddingTop: 40,
        paddingLeft: 0,
        backgroundColor: backdropColor ? backdropColor : "white"
      }}
    >
      <Button
        buttonStyle={{
          backgroundColor: backdropColor ? backdropColor : "white",
          justifyContent: "flex-start"
        }}
        title=""
        icon={
          <Icon
            name="arrow-left"
            color={buttonColor ? buttonColor : "grey"}
            size="20"
          />
        }
        onPress={clicked}
      />
    </View>
  );
};

export default backButton;
