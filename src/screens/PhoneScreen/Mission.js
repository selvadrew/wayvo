import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";
import { sendFeedback } from "../../store/actions/users";
import { Dropdown } from 'react-native-material-dropdown';

class Mission extends Component {
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

  render() {

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <View style={styles.wrapper}>
          <Text style={styles.header}>
            How Wayvo Works
          </Text>
          {/* <Text style={styles.subtitle}>
            Wayvo is an automated personal assistant that schedules phone calls for you with all the people you care about
          </Text> */}

          <View style={styles.numberedItemWrapper}>
            <View style={styles.bulletTextWrapper}>
              <Text style={styles.blueText}>You do this once</Text>
            </View>
            <View style={styles.bulletTextWrapper}>
              <Text style={styles.bulletText}>Choose how often you want to catch-up with each friend (once a week, once a month, etc). For example, if you choose once a month, you'll be able to invite that friend to schedule a call with you today and then again after 30 days. </Text>
            </View>
          </View>

          <View style={styles.numberedItemWrapper}>
            <View style={styles.bulletTextWrapper}>
              <Text style={styles.blueText}>You do this every day</Text>
            </View>
            <View style={styles.bulletTextWrapper}>
              <Text style={styles.bulletText}>Update your Calendar and send friends an invitation to schedule a 1-on-1 call with you.</Text>
            </View>
          </View>

          <View style={styles.numberedItemWrapper}>
            <View style={styles.bulletTextWrapper}>
              <Text style={styles.blueText}>And Wayvo manages the rest</Text>
            </View>
            <View style={styles.bulletTextWrapper}>
              <Text style={styles.bulletText}>
                Wayvo will help your friends choose a time in your Calendar to schedule a call with you. Wayvo will notify you once a call is scheduled and 15 minutes before the call as well.
                </Text>
            </View>
          </View>


        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 15
  },
  wrapper: {
    flex: 1,
    // alignContent: "center",
    // justifyContent: "center",
    marginBottom: 10
  },
  header: {
    fontSize: Dimensions.get("window").width > 330 ? 24 : 22,
    color: "#111",
    fontWeight: "500",
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: 35
  },
  subtitle: {
    fontSize: Dimensions.get("window").width > 330 ? 16 : 14,
    color: "#333",
    fontWeight: "400",
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: 35
  },
  numberedItemWrapper: {
    fontSize: Dimensions.get("window").width > 330 ? 22 : 20,
    color: "#111",
    fontWeight: "500",
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    // flexDirection: "row",
    // alignItems: "center",
    // width: "100%",
    marginBottom: 30
    // padding: 11
  },
  bulletNumberWrapper: {
    width: "10%",
  },
  bulletNumber: {
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    color: "#111",
    flexDirection: "column",
    justifyContent: "flex-start",
    // textAlign: "center"
    // fontWeight: "900"
  },
  bulletTextWrapper: {
    // width: "90%",
  },
  blueText: {
    fontSize: Dimensions.get("window").width > 330 ? 20 : 16,
    color: colors.blueColor,
    fontWeight: "600",
    marginBottom: 3
    // textDecorationLine: "underline"
  },
  bulletText: {
    fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
    color: "#111",
  }
});

const mapDispatchToProps = dispatch => {
  return {
    sendFeedback: description => dispatch(sendFeedback(description))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Mission);
