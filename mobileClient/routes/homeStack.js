import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/home.js";
import CreateRoom from "../screens/createRoom.js";
import Room from "../screens/room.js";
import Pay from "../screens/pay.js";
import JoinRoom from "../screens/joinRoom.js";
import SendMoney from "../screens/sendMoney.js";

const screens = {
  Home: {
    screen: Home,
    headerMode: "none"
  },
  JoinRoom: {
    screen: JoinRoom
  },
  CreateRoom: {
    screen: CreateRoom
  },
  Room: {
    screen: Room
  },
  Pay: {
    screen: Pay
  },
  SendMoney: {
    screen: SendMoney
  }
};

const HomeStack = createStackNavigator(screens, {
  mode: "modal"
});

export default createAppContainer(HomeStack);
