import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  StatusBar,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

import { logout } from "../../store/actions/users";
import phoneNumberTab from "../MainTabs/phoneNumberTab";

class OptionScreen extends Component {
  static navigatorStyle = {
    navBarHidden: false,
    statusBarColor: colors.darkBlue,
    navBarBackgroundColor: colors.darkBlue,
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
          <TouchableWithoutFeedback onPress={() => this.feedbackScreen()}>
            <View>
              <Text style={[styles.logoutText]}>Feedback</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.phoneNumberScreen()}>
            <View>
              <Text style={[styles.logoutText]}>Change phone number</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.props.onLogout()}>
            <View>
              <Text style={[styles.logoutText]}>Logout</Text>
            </View>
          </TouchableWithoutFeedback>
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
    textAlign: "center",
    marginBottom: 20
  },
  logoutText: {
    color: "#444",
    padding: 10,
    width: 250,
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333"
  },
  name: {
    fontWeight: "bold",
    fontSize: 25,
    color: colors.blueColor,
    textAlign: "center"
  },
  username: {
    fontWeight: "bold",
    fontSize: 25,
    color: colors.pinkColor,
    textAlign: "center"
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
