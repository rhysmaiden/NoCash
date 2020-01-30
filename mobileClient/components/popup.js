import React from "react";
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton,
  DialogTitle
} from "react-native-popup-dialog";

import { Text } from "react-native";

const Popup = ({ options, onSelectOption, title, popup, message }) => {
  return (
    <Dialog
      footer={
        <DialogFooter>
          {options.map((option, index) => (
            <DialogButton text={option} onPress={() => onSelectOption(index)} />
          ))}
        </DialogFooter>
      }
      dialogTitle={<DialogTitle title={title} />}
      visible={popup}
      onTouchOutside={() => {}}
    >
      <DialogContent
        style={{
          margin: 10
        }}
      >
        {<Text>{message}</Text>}
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
