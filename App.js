import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";

import configureStore from "./src/store/configureStore";
import LoadingScreen from "./src/screens/Auth/Loading";
import AuthScreen from "./src/screens/Auth/Auth";
import EmailCode from "./src/screens/Auth/EmailCode";
import Username from "./src/screens/Auth/Username";
import PhoneNumber from "./src/screens/Auth/PhoneNumber";
import SignUp from "./src/screens/Auth/SignUp";
import LogIn from "./src/screens/Auth/LogIn";
import Fullname from "./src/screens/Auth/Fullname";
import Terms from "./src/screens/Auth/Terms";
import PhoneScreen from "./src/screens/PhoneScreen/PhoneScreen";
import SaidHello from "./src/screens/PhoneScreen/SaidHello";
import SaidHelloGroups from "./src/screens/PhoneScreen/SaidHelloGroups";
import OptionScreen from "./src/screens/PhoneScreen/OptionScreen";
import HowItWorks from "./src/screens/PhoneScreen/HowItWorks";
import Feedback from "./src/screens/PhoneScreen/Feedback";
import Mission from "./src/screens/PhoneScreen/Mission";
import Topics from "./src/screens/PhoneScreen/Topics";
import FriendsScreen from "./src/screens/Friends/Friends";
import FriendSelectedScreen from "./src/screens/Friends/FriendDetail";
import GroupsScreen from "./src/screens/Groups/Groups";
import GroupSelectedScreen from "./src/screens/Groups/GroupDetail";
import CustomGroupSelectedScreen from "./src/screens/Groups/CustomGroupDetail";
import CreateGroupScreen from "./src/screens/Groups/CreateGroup";
import JoinGroupScreen from "./src/screens/Groups/JoinGroup";
import ActiveFriendsScreen from "./src/screens/ActiveFriends/ActiveFriends";
import ConnectedStatusScreen from "./src/screens/ActiveFriends/ConnectedStatus";
import ConnectedStatusGroupsScreen from "./src/screens/ActiveFriends/ConnectedStatusGroups";
import ConnectedStatusCustomGroupsScreen from "./src/screens/ActiveFriends/ConnectedStatusCustomGroups";
import PlanActivitySelection from "./src/screens/Plans/PlanActivitySelection";
import PlanTimeSelection from "./src/screens/Plans/PlanTimeSelection";
import PlanExplodingOffer from "./src/screens/Plans/PlanExplodingOffer";
import PlanSendInvite from "./src/screens/Plans/PlanSendInvite";
import PlanChat from "./src/screens/Plans/PlanChat";
import InviteFriends from "./src/screens/Plans/InviteFriends";

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from react-native core']);

const store = configureStore();

// Register Screens
Navigation.registerComponent(
  "awesome-places.LoadingScreen",
  () => LoadingScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.AuthScreen",
  () => AuthScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.EmailCode",
  () => EmailCode,
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
  "awesome-places.SignUp",
  () => SignUp,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.Fullname",
  () => Fullname,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.LogIn",
  () => LogIn,
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
  "awesome-places.SaidHelloGroups",
  () => SaidHelloGroups,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.OptionScreen",
  () => OptionScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.HowItWorks",
  () => HowItWorks,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.Feedback",
  () => Feedback,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.Mission",
  () => Mission,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.Topics",
  () => Topics,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.Terms",
  () => Terms,
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
  "awesome-places.GroupsScreen",
  () => GroupsScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.GroupSelectedScreen",
  () => GroupSelectedScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.CustomGroupSelectedScreen",
  () => CustomGroupSelectedScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.CreateGroupScreen",
  () => CreateGroupScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.JoinGroupScreen",
  () => JoinGroupScreen,
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

Navigation.registerComponent(
  "awesome-places.ConnectedStatusGroupsScreen",
  () => ConnectedStatusGroupsScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.ConnectedStatusCustomGroupsScreen",
  () => ConnectedStatusCustomGroupsScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.PlanActivitySelection",
  () => PlanActivitySelection,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.PlanTimeSelection",
  () => PlanTimeSelection,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.PlanExplodingOffer",
  () => PlanExplodingOffer,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.PlanSendInvite",
  () => PlanSendInvite,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.PlanChat",
  () => PlanChat,
  store,
  Provider
);

Navigation.registerComponent(
  "awesome-places.InviteFriends",
  () => InviteFriends,
  store,
  Provider
);

// Start App
Navigation.startSingleScreenApp({
  screen: {
    screen: "awesome-places.LoadingScreen"
    //title: "Login"
  }
});
