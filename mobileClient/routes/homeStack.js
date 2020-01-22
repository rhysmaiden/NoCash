import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/home.js";
import GameSetup from "../screens/gameSetup.js";
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
  GameSetup: {
    screen: GameSetup
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
