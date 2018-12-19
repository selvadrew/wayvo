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

class Mission extends Component {
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
        <Text style={styles.subtitle}>About</Text>
        <Text style={styles.header}>
          Wayvo helps you get to know and meaningfully connect with the friends
          you make at university. It connects you with them over a phone call
          whenever you have some free time. Just Wayvo the next time you're
          walking to class or taking a study break and catch up with a friend.
        </Text>
        <Text style={[styles.subtitle, styles.header2]}>Presence</Text>
        <Text style={styles.header}>
          It’s used by students from all the universities below. Don’t see
          yours? Let us know in the feedback section and we’ll be there soon.
        </Text>

        <View style={styles.uniPicRow}>
          <Image
            source={require("../../assets/Western.png")}
            style={styles.uniPic}
          />
          <Image
            source={require("../../assets/Ryerson.png")}
            style={styles.uniPic}
          />
          <Image
            source={require("../../assets/Laurier.png")}
            style={styles.uniPic}
          />
        </View>
        <View style={styles.uniPicRow}>
          <Image
            source={require("../../assets/Guelph.png")}
            style={styles.uniPic}
          />
          <Image
            source={require("../../assets/Queens.png")}
            style={styles.uniPic}
          />
          <Image
            source={require("../../assets/UW.png")}
            style={styles.uniPic}
          />
        </View>

        <Text style={[styles.note, styles.header2]}>
          Note: Wayvo is not associated or affiliated with or sponsored or
          endorsed by any school.
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#fff",
    padding: 20
  },
  subtitle: {
    fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
    color: "#111",
    fontWeight: "600",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    letterSpacing: 0.6,
    marginBottom: 5,
    textDecorationLine: "underline"
  },
  header: {
    fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
    color: "#111",
    fontWeight: "400",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    letterSpacing: 0.6,
    lineHeight: Dimensions.get("window").width > 330 ? 25 : 20
  },
  header2: {
    marginTop: 20
  },
  note: {
    fontSize: Dimensions.get("window").width > 330 ? 14 : 14,
    color: "#111",
    fontWeight: "400",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    letterSpacing: 0.6,
    marginBottom: 50
    //lineHeight: 25
  },
  uniPicRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20
  },
  uniPic: {
    resizeMode: "contain",
    width: "30%",
    height: 50
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
