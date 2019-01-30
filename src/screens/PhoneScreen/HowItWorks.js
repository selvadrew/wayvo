import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  Image,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";

class HowItWorks extends Component {
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

  render() {
    const start_bracket = "(";
    const end_bracket = ")";
    const dash = "-";

    let phone_number = this.props.phone_number;
    formatted_phone_number = phone_number.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1-$2-$3"
    );

    let throughFT = null;
    if (Platform.OS === "ios") {
      throughFT = <Text>or through FaceTime </Text>;
    }

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      >
        {/* <View style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>What happens when I Say Hello?</Text>
          </View>
        </View> */}

        <Image
          source={require("../../assets/Info-1.png")}
          style={styles.infoTwo}
        />
        <View>
          <Text style={styles.text}>
            When you Say Hello, all your friends or group members receive a
            notification
          </Text>
        </View>

        <Image
          source={require("../../assets/Info-2.png")}
          style={styles.infoTwo}
        />
        <View>
          <Text style={styles.text}>
            The first person to Say Hello Back before time expires gets to call
            you
          </Text>
        </View>

        <Image
          source={require("../../assets/Info-3.png")}
          style={styles.infoOne}
        />
        <View>
          <Text style={styles.text}>
            You will receive a call at {formatted_phone_number} {throughFT}
          </Text>
        </View>

        {/* <View style={styles.wrapper}>
          <View style={styles.numberHolder}>
            <View style={styles.numberWrapper1}>
              <Text style={styles.numberText}>1</Text>
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              All your selected friends who have{" "}
              <Text style={{ color: colors.pinkColor }}>
                {this.props.username}
              </Text>{" "}
              in their friend list will receive a notification
            </Text>
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.numberHolder}>
            <View style={styles.numberWrapper2}>
              <Text style={styles.numberText}>2</Text>
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              You will receive a call at{" "}
              <Text style={{ color: colors.greenColor }}>
                {formatted_phone_number}
              </Text>{" "}
              {throughFT}
              from the first friend to open Wayvo and Say Hello Back
            </Text>
          </View>
        </View> */}

        {/* <View style={styles.wrapper}>
          <View style={styles.numberHolder}>
            <View style={styles.numberWrapper}>
              <Text style={styles.numberText}>2b</Text>
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              If no friends Say Hello back within the time you selected,
              nothing happens
            </Text>
          </View>
        </View> */}
      </ScrollView>
    );
  }
}
//If all your friends are busy and are not able to Say Hello back within the time you selected, nothing happens.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
    backgroundColor: "#fff"
    //alignItems: "center"
    // justifyContent: "center",
    // flexDirection: "column"
  },
  infoOne: {
    resizeMode: "contain",
    height: Dimensions.get("window").width * 0.6,
    width: Dimensions.get("window").width * 0.6,
    alignItems: "center"
  },
  infoTwo: {
    resizeMode: "contain",
    height: Dimensions.get("window").width * 0.65,
    width: Dimensions.get("window").width * 0.65,
    alignItems: "center"
  },
  titleWrapper: {
    justifyContent: "center",
    width: "100%"
  },
  title: {
    textAlign: "center",
    fontSize: Dimensions.get("window").width > 330 ? 21 : 18,
    fontWeight: "700",
    padding: 5,
    color: "#444",
    letterSpacing: 1,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  wrapper: {
    flexDirection: "row",
    marginBottom: 40
  },
  numberHolder: {
    width: "15%",
    marginLeft: 10,
    marginRight: 10
  },
  numberWrapper1: {
    width: "100%",
    backgroundColor: colors.pinkColor,
    alignItems: "center",
    borderRadius: 100
  },
  numberWrapper2: {
    width: "100%",
    backgroundColor: colors.greenColor,
    alignItems: "center",
    borderRadius: 100
  },
  numberText: {
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
    alignItems: "center",
    color: "#fff",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 5
  },
  textWrapper: {
    width: "85%"
  },
  text: {
    padding: 20,
    fontWeight: "600",
    fontSize: Dimensions.get("window").width > 330 ? 22 : 17,
    color: "#222",
    letterSpacing: 1,
    //textAlign: "center",
    marginBottom: 50,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  }
});

export default HowItWorks;
