import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";

import AuthScreen from "./src/screens/Auth/Auth";
import Username from "./src/screens/Auth/Username";
import PhoneNumber from "./src/screens/Auth/PhoneNumber";
import PhoneScreen from "./src/screens/PhoneScreen/PhoneScreen";
import SaidHello from "./src/screens/PhoneScreen/SaidHello";
import FriendsScreen from "./src/screens/Friends/Friends";
import FriendSelectedScreen from "./src/screens/Friends/FriendDetail";
import ActiveFriendsScreen from "./src/screens/ActiveFriends/ActiveFriends";
import ConnectedStatusScreen from "./src/screens/ActiveFriends/ConnectedStatus";
import configureStore from "./src/store/configureStore";

const store = configureStore();

// Register Screens
Navigation.registerComponent(
  "awesome-places.AuthScreen",
  () => AuthScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.Username",
  () => Username,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.PhoneNumber",
  () => PhoneNumber,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.PhoneScreen",
  () => PhoneScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.SaidHello",
  () => SaidHello,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.FriendsScreen",
  () => FriendsScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.FriendSelectedScreen",
  () => FriendSelectedScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.ActiveFriendsScreen",
  () => ActiveFriendsScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.ConnectedStatusScreen",
  () => ConnectedStatusScreen,
  store,
  Provider
);

// Start App
Navigation.startSingleScreenApp({
  screen: {
    screen: "awesome-places.AuthScreen",
    title: "Login"
  }
});
