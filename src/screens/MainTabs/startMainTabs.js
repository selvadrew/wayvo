import { Navigation } from "react-native-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../../utils/styling";

const startTabs = () => {
  Promise.all([
    Icon.getImageSource("ios-people", 35),
    Icon.getImageSource("md-hand", 35),
    Icon.getImageSource("ios-radio-button-on", 35)
  ]).then(sources => {
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: "awesome-places.PhoneScreen",
          label: "Wave",
          //title: "Phone",
          icon: sources[1]
        },
        {
          screen: "awesome-places.FriendsScreen",
          label: "Contacts",
          //title: "Friends",
          icon: sources[0]
        },
        {
          screen: "awesome-places.ActiveFriendsScreen",
          label: "Active",
          //title: "Active Friends",
          icon: sources[2]
        }
      ],
      tabsStyle: {
        tabBarBackgroundColor: colors.tabBackgroundColor, // optional, change the background color of the tab bar
        tabBarButtonColor: "gray", // optional, change the color of the tab icons and text (also unselected). On Android, add this to appStyle

        tabBarSelectedButtonColor: "#fff" // optional, change the color of the selected tab icon and text (only selected). On Android, add this to appStyle
      },
      appStyle: {
        tabBarBackgroundColor: colors.tabBackgroundColor,
        tabBarButtonColor: "gray",

        orientation: "portrait", // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
        tabBarSelectedButtonColor: "#fff"
        //bottomTabBadgeTextColor: "red", // Optional, change badge text color. Android only
        //bottomTabBadgeBackgroundColor: "black" // Optional, change badge background color. Android only
        // backButtonImage: require("./pathToImage.png"), // Change the back button default arrow image with provided image. iOS only
        // hideBackButtonTitle: true / false // Hide back button title. Default is false. If `backButtonTitle` provided so it will take into account and the `backButtonTitle` value will show. iOS only
      }
    });
  });
};

export default startTabs;
