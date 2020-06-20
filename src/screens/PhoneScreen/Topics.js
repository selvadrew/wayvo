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
  Image,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

class Topics extends Component {
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

  state = {
    one: false,
    two: false,
    three: false,
    four: false,
    five: false
  }

  toggle = number => {
    this.setState({
      [number]: !this.state[number]
    })
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <View style={styles.container2}>
          <Text style={styles.header}>
            Frequently Asked Questions
          </Text>

          <TouchableWithoutFeedback onPress={() => this.toggle("one")}>
            <View style={styles.qaWrapper}>
              <View style={styles.questionWrapper}>
                <Text style={styles.questionText}>
                  Are phone calls scheduled to be 30 minutes long?
              </Text>
              </View>
              <View style={this.state.one ? styles.answerWrapper : styles.dontShow}>
                <Text style={styles.answerText}>
                  No, whether it’s a quick 10 minute check-in or a 1 hour life-chat, the duration of the phone call is up to you and your friend. Wayvo only helps you plan the start time of your phone calls.
              </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>


          <TouchableWithoutFeedback onPress={() => this.toggle("two")}>
            <View style={styles.qaWrapper}>
              <View style={styles.questionWrapper}>
                <Text style={styles.questionText}>
                  How many invitations will Wayvo send each day?
              </Text>
              </View>
              <View style={this.state.two ? styles.answerWrapper : styles.dontShow}>
                <Text style={styles.answerText}>
                  Wayvo will invite 0-3 friends to catch-up each day. The exact number of invitations that will be sent depends on how many options you suggest in your Calendar and how many friends it's time to catch-up with. For example, if you have multiple times suggested in your Calendar, Wayvo might send 2 friends an invitation to catch-up. If you have no times set aside in your Calendar, Wayvo will not send anyone an invitation to catch-up.
              </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>


          <TouchableWithoutFeedback onPress={() => this.toggle("three")}>
            <View style={styles.qaWrapper}>
              <View style={styles.questionWrapper}>
                <Text style={styles.questionText}>
                  I chose to catch-up with a friend every two weeks. When will the first invitation be sent?
              </Text>
              </View>
              <View style={this.state.three ? styles.answerWrapper : styles.dontShow}>
                <Text style={styles.answerText}>
                  If you’ve never connected with a friend on Wayvo, the first invitation will be sent the next time you update your Calendar (if the daily limit of 3 invitations has not been reached yet). After you connect, the next invitation will be sent on the 14th day(in two weeks) or later, depending on when you update your Calendar again.
              </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>


          <TouchableWithoutFeedback onPress={() => this.toggle("four")}>
            <View style={styles.qaWrapper}>
              <View style={styles.questionWrapper}>
                <Text style={styles.questionText}>
                  What if I don’t have time to catch-up with anyone today?
              </Text>
              </View>
              <View style={this.state.four ? styles.answerWrapper : styles.dontShow}>
                <Text style={styles.answerText}>
                  Too busy to connect over a phone call? Don’t worry, just don’t suggest any times in your Calendar - Wayvo will not send any friends an invitation to catch-up if your Calendar is empty (has no green selections).
              </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>


          <TouchableWithoutFeedback onPress={() => this.toggle("five")}>
            <View style={styles.qaWrapper}>
              <View style={styles.questionWrapper}>
                <Text style={styles.questionText}>
                  How do I delete someone from my Friends list?
              </Text>
              </View>
              <View style={this.state.five ? styles.answerWrapper : styles.dontShow}>
                <Text style={styles.answerText}>
                  Just press and hold on a friend’s name in the Relationships tab to delete them.
              </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>


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
  header: {
    fontSize: Dimensions.get("window").width > 330 ? 21 : 18,
    color: "#111",
    fontWeight: "500",
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: 35
  },
  qaWrapper: {
    marginBottom: 20
  },
  questionWrapper: {
    backgroundColor: "#eee",
    padding: 10
  },
  questionText: {
    fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
    color: "#111",
  },
  answerWrapper: {
    padding: 15,
    borderColor: "#eee",
    borderWidth: 1
  },
  answerText: {
    fontSize: Dimensions.get("window").width > 330 ? 16 : 14,
  },
  dontShow: {
    display: "none"
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
