import { Navigation } from "react-native-navigation";

const authTab = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "awesome-places.AuthScreen",
      title: "Connect in real life"
    }
  });
};

export default authTab;
