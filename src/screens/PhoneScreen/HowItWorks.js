import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar, Dimensions } from "react-native";
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

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>What happens when you Say Hello?</Text>
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.numberHolder}>
            <View style={styles.numberWrapper1}>
              <Text style={styles.numberText}>1</Text>
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              All your contacts who have{" "}
              <Text style={{ color: colors.pinkColor }}>
                {this.props.username}
              </Text>{" "}
              in their contact list will receive a notification
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
              from the first contact to open Wayvo and Say Hello Back
            </Text>
          </View>
        </View>

        {/* <View style={styles.wrapper}>
          <View style={styles.numberHolder}>
            <View style={styles.numberWrapper}>
              <Text style={styles.numberText}>2b</Text>
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              If no contacts Say Hello back within the time you selected,
              nothing happens
            </Text>
          </View>
        </View> */}
      </View>
    );
  }
}
//If all your contacts are busy and are not able to Say Hello back within the time you selected, nothing happens.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#fff"
    // alignItems: "center",
    // justifyContent: "center",
    // flexDirection: "column"
  },
  titleWrapper: {
    justifyContent: "center",
    width: "100%"
  },
  title: {
    textAlign: "center",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontWeight: "700",
    padding: 5,
    color: "#000"
  },
  wrapper: {
    flexDirection: "row",
    marginBottom: 40
  },
  numberHolder: {
    width: "20%",
    marginLeft: 10,
    marginRight: 10
  },
  numberWrapper1: {
    width: "90%",
    backgroundColor: colors.pinkColor,
    alignItems: "center",
    borderRadius: 100
  },
  numberWrapper2: {
    width: "90%",
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
    width: "80%"
  },
  text: {
    paddingRight: 20,
    fontWeight: "600",
    fontSize: Dimensions.get("window").width > 330 ? 19 : 17,
    color: "#333",
    marginRight: 10
  }
});

export default HowItWorks;
