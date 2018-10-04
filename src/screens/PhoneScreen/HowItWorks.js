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
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>What happens when you Say Hello?</Text>
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.numberHolder}>
            <View style={styles.numberWrapper}>
              <Text style={styles.numberText}>1</Text>
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              All your contacts will receive a notification (only if they have
              you as a contact as well)
            </Text>
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.numberHolder}>
            <View style={styles.numberWrapper}>
              <Text style={styles.numberText}>2a</Text>
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              You will receive a phone call from the first contact to open the
              notification and Say Hello back
              {/* The first contact to open your notification and Say Hello back,
              gets connected with you over a phone call. */}
            </Text>
          </View>
        </View>

        <View style={styles.wrapper}>
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
        </View>
      </View>
    );
  }
}
//If all your contacts are busy and are not able to Say Hello back within the time you selected, nothing happens.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
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
  numberWrapper: {
    width: "90%",
    backgroundColor: colors.yellowColor,
    alignItems: "center",
    borderRadius: 100
  },
  numberText: {
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
    alignItems: "center",
    color: "#333",
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
    fontSize: Dimensions.get("window").width > 330 ? 16 : 15,
    color: "#333",
    marginRight: 5
  }
});

export default HowItWorks;
