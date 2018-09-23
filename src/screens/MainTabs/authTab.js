import { Navigation } from "react-native-navigation";

const authTab = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "awesome-places.AuthScreen"
      // title: "Save Phone Number"
    }
  });
};

export default authTab;
