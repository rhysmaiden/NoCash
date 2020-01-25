import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Button, ListItem } from "react-native-material-ui";
import { LinearGradient } from "expo";

import {
  TextField,
  FilledTextField,
  OutlinedTextField
} from "react-native-material-textfield";

//TODO: Refactor Large and small into one contained class

export default userPlate = props => {
  useEffect(() => {}, []);

  return (
    <View style={{ padding: 10 }}>
      {props.version == "large" ? (
        <View
          style={{
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
          }}
        >
          <View
            style={{
              borderRadius: 100,
              borderColor: "white",
              borderWidth: 5,

              justifyContent: "center",
              height: 200,
              width: 200
            }}
          >
            {props.cash == 0 ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 40,
                    color: "white"
                  }}
                >
                  ${props.cash}
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 15,
                    color: "white"
                  }}
                >
                  {props.name}
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            justifyContent: "center",
            borderBottomColor: "gray",
            borderBottomWidth: 0.5,
            borderRadius: 50,
            backgroundColor: "rgb(52,186,241)"
          }}
        >
          <View
            style={{
              borderRadius: 100,
              borderColor: "white",
              borderWidth: 5,

              justifyContent: "center",
              height: 100,
              width: 100
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                color: "white"
              }}
            >
              ${props.cash}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "white"
              }}
            >
              {props.name}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
