import React from "react";
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton,
  DialogTitle
} from "react-native-popup-dialog";

import { Text } from "react-native";

const Popup = props => {
  return (
    <Dialog
      footer={
        <DialogFooter>
          {props.options.map((option, index) => (
            <DialogButton
              text={option}
              onPress={() => props.onSelectOption(index)}
            />
          ))}
        </DialogFooter>
      }
      dialogTitle={<DialogTitle title={props.title} />}
      visible={props.popup}
      onTouchOutside={() => {}}
    >
      <DialogContent
        style={{
          margin: 10
        }}
      >
        {<Text>{props.message}</Text>}
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
