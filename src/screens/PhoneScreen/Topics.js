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

class Topics extends Component {
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <View style={styles.container2}>
          <View>
            <Text style={styles.header}>
              Get to know your friends better by asking them these questions
            </Text>
          </View>
          <View style={styles.bulletWrapper}>
            <View style={styles.bullet}>
              <Text style={styles.questionText}>{"\u2022"}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.questionText}>
                What's your average day like?
              </Text>
            </View>
          </View>
          <View style={styles.bulletWrapper}>
            <View style={styles.bullet}>
              <Text style={styles.questionText}>{"\u2022"}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.questionText}>
                What's one thing you want to do before you die?
              </Text>
            </View>
          </View>
          <View style={styles.bulletWrapper}>
            <View style={styles.bullet}>
              <Text style={styles.questionText}>{"\u2022"}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.questionText}>
                Are there any places you want to visit in the city?
              </Text>
            </View>
          </View>
          <View style={styles.bulletWrapper}>
            <View style={styles.bullet}>
              <Text style={styles.questionText}>{"\u2022"}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.questionText}>
                What are you most passionate about?
              </Text>
            </View>
          </View>

          <View style={styles.bulletWrapper}>
            <View style={styles.bullet}>
              <Text style={styles.questionText}>{"\u2022"}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.questionText}>
                Anything in the news catch your attention recently?
              </Text>
            </View>
          </View>
          <View style={styles.bulletWrapper}>
            <View style={styles.bullet}>
              <Text style={styles.questionText}>{"\u2022"}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.questionText}>
                Where was your favourite vacation to?
              </Text>
            </View>
          </View>
          <View style={styles.bulletWrapper}>
            <View style={styles.bullet}>
              <Text style={styles.questionText}>{"\u2022"}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.questionText}>
                What was the most difficult moment in your life?
              </Text>
            </View>
          </View>
          <View style={styles.bulletWrapper}>
            <View style={styles.bullet}>
              <Text style={styles.questionText}>{"\u2022"}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.questionText}>
                What are some of your career goals?
              </Text>
            </View>
          </View>

          <View style={styles.bulletWrapper}>
            <View style={styles.bullet}>
              <Text style={styles.questionText}>{"\u2022"}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.questionText}>
                Do anything exciting recently?
              </Text>
            </View>
          </View>
          {/* <Text style={styles.bulletWrapper}>
          {"\u2022"} What's your average day like?{"\n"}
          {"\u2022"} What's one thing you want to do before you die?{"\n"}
          {"\u2022"} Are there any places you want to visit in the city?{"\n"}
          {"\u2022"} Anything in the news catch your attention recently?{"\n"}
          {"\u2022"} Where was your favourite vacation to?{"\n"}
          {"\u2022"} What was the most difficult moment of your life?{"\n"}
          {"\u2022"} What are some of your career goals?{"\n"}
        </Text> */}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
    // margin: 20,
    // marginTop: 15,
    // marginBottom: 30
  },
  container2: {
    margin: 20
  },
  bulletWrapper: {
    flexDirection: "row",
    marginBottom: 20
  },
  bullet: {
    width: "10%"
  },
  textWrapper: {
    width: "90%"
  },
  header: {
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    color: "#444",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    // backgroundColor: colors.greenColor,
    fontWeight: "600",
    marginBottom: 20,
    padding: 10,
    textAlign: "center",
    letterSpacing: 0.6
  },
  questionText: {
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    color: colors.darkBlue,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontWeight: "600",
    letterSpacing: 0.6
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
)(Topics);
