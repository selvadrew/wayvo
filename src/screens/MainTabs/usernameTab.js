import { Navigation } from "react-native-navigation";

const usernameTab = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "awesome-places.Username",
      title: "Create Username"
    }
  });
};

export default usernameTab;
