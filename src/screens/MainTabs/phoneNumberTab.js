import { Navigation } from "react-native-navigation";

const phoneNumberTab = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "awesome-places.PhoneNumber",
      title: "Save Phone Number"
    }
  });
};

export default phoneNumberTab;
