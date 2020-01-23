import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/home.js";
import CreateRoom from "../screens/createRoom.js";
import Room from "../screens/room.js";
import Pay from "../screens/pay.js";
import JoinRoom from "../screens/joinRoom.js";

const screens = {
  Home: {
    screen: Home
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
  }
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
