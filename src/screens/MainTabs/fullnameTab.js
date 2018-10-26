import { Navigation } from "react-native-navigation";

const fullnameTab = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "awesome-places.Fullname"
      //title: "Create Username"
    }
  });
};

export default fullnameTab;
