import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  StatusBar,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  Image,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";
import Icon from "react-native-vector-icons/Ionicons";

import { logout } from "../../store/actions/users";
import phoneNumberTab from "../MainTabs/phoneNumberTab";

class OptionScreen extends Component {
  static navigatorStyle = {
    navBarHidden: false,
    statusBarColor: colors.blueColor,
    navBarBackgroundColor: colors.blueColor,
    navBarButtonColor: "#fff",
    navBarTextColor: "#fff"
  };
  constructor(props) {
    super(props);
  }

  phoneNumberScreen = () => {
    this.props.navigator.push({
      screen: "awesome-places.PhoneNumber",
      backButtonTitle: "",
      backButtonHidden: false,
      navigatorStyle: {
        navBarHidden: false,
        statusBarColor: colors.darkBlue,
        navBarBackgroundColor: colors.darkBlue,
        navBarButtonColor: "#fff",
        navBarTextColor: "#fff"
      }
    });
  };

  howItWorksScreen = () => {
    this.props.navigator.push({
      screen: "awesome-places.HowItWorks",
      backButtonTitle: ""
    });
  };

  feedbackScreen = () => {
    this.props.navigator.push({
      screen: "awesome-places.Feedback",
      backButtonTitle: ""
    });
  };

  missionScreen = () => {
    this.props.navigator.push({
      screen: "awesome-places.Mission",
      backButtonTitle: ""
    });
  };

  topicsScreen = () => {
    this.props.navigator.push({
      screen: "awesome-places.Topics",
      backButtonTitle: ""
    });
  };

  logoutPrompt = () => {
    Alert.alert(
      "Are you sure you want to log out?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => this.props.onLogout() }
      ],
      { cancelable: true }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.darkBlue} />

        <View style={styles.topBox}>
          <View>
            <Text style={styles.name}>{this.props.fullname}</Text>
            <Text style={styles.username}>{this.props.username}</Text>
          </View>
        </View>

        <View style={styles.bottomBox}>
          <TouchableWithoutFeedback onPress={() => this.missionScreen()}>
            {/* <View style={styles.iconWrapper}>
              <View style={styles.imageWrapper}>
                <Image
                  source={require("../../assets/Wayvo-Icon.png")}
                  style={styles.logo}
                />
              </View> */}
            <Text style={[styles.logoutText]}>How Wayvo Works</Text>
            {/* </View> */}
          </TouchableWithoutFeedback>

          {/* <TouchableWithoutFeedback onPress={() => this.topicsScreen()}>
            <View style={styles.iconWrapper}>
              <View style={styles.imageWrapper}>
                <Image
                  source={require("../../assets/Wayvo-Icon.png")}
                  style={styles.logo}
                />
              </View>
            <Text style={[styles.logoutText]}>FAQ's</Text>
            </View>
          </TouchableWithoutFeedback> */}

          {/* <TouchableWithoutFeedback onPress={() => this.topicsScreen()}>

            <Text style={[styles.logoutText]}>FAQ's</Text>

          </TouchableWithoutFeedback> */}

          <TouchableWithoutFeedback onPress={() => this.feedbackScreen()}>
            {/* <View style={styles.iconWrapper}>
              <View style={styles.imageWrapper}>
                <Image
                  source={require("../../assets/Heart-Icon.png")}
                  style={styles.logo}
                />
              </View> */}
            <Text style={[styles.logoutText]}>Send Feedback</Text>
            {/* </View> */}
          </TouchableWithoutFeedback>



          {/* <TouchableWithoutFeedback onPress={() => this.logoutPrompt()}>
            <View>
              <Text style={[styles.logoutText]}>Logout</Text>
            </View>
          </TouchableWithoutFeedback> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  topBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  bottomBox: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  text: {
    color: "#fff",
    padding: 15,
    width: 300,
    fontWeight: "600",
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    textAlign: "center",
    marginBottom: 20
  },

  name: {
    fontWeight: "bold",
    fontSize: 28,
    color: colors.blueColor,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
  },
  username: {
    fontWeight: "bold",
    fontSize: 28,
    color: colors.pinkColor,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
  },
  iconWrapper: {
    width: "100%",
    //flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25
  },
  logoutText: {
    color: "#222",
    //padding: 10,
    //width: 250,
    width: "70%",
    fontWeight: "500",
    fontSize: Dimensions.get("window").width > 330 ? 23 : 20,
    textAlign: "center",
    //marginBottom: 20,
    //borderWidth: 1,
    borderColor: "#444",
    borderRadius: 0,
    letterSpacing: 1,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    marginBottom: 25
  },
  imageWrapper: {
    width: "30%",
    alignItems: "flex-end",
    marginRight: 20
  },
  logo: {
    resizeMode: "contain",
    height: Dimensions.get("window").width > 330 ? 40 : 35,
    width: Dimensions.get("window").width > 330 ? 50 : 45,
    alignItems: "center"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(logout())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(OptionScreen);
