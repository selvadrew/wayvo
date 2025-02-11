import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
  Dimensions,
  Alert
} from "react-native";
import { connect } from "react-redux";
import call from "react-native-phone-call";
import { joinCall } from "../../store/actions/activeFriends";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";
import { Facetime } from "react-native-openanything";

class GroupDetail extends Component {
  componentDidMount() {
    // this.props.onJoinCall(this.props.id);
  }

  static navigatorStyle = {
    navBarNoBorder: true,
    navBarHidden: false,
    //drawUnderNavBar: true,
    //navBarTransparent: true,
    //navBarTranslucent: Platform.OS === "ios" ? false : false,
    topBarElevationShadowEnabled: false,
    //navBarButtonColor: "#000",
    statusBarColor: colors.greenColor,
    navBarBackgroundColor: colors.greenColor,
    navBarButtonColor: "#FFF"
  };
  constructor(props) {
    super(props);
  }

  callOptions = (number, args) => {
    Alert.alert(
      "How would you like to start this call?",
      "",
      [
        {
          text: "FaceTime Video",
          onPress: () => this.ftv(number)
        },
        {
          text: "FaceTime Audio",
          onPress: () => this.fta(number)
        },
        { text: "Phone Call", onPress: () => call(args).catch(console.error) }
      ],
      { cancelable: false }
    );
  };

  ftv = number => {
    Facetime(number, (audioOnly = false)).catch(err => alert(err));
  };
  fta = number => {
    Facetime(number, (audioOnly = true)).catch(err => alert(err));
  };

  render() {
    let number = "1" + this.props.phone_number;
    const args = {
      number: number, // String value with the number to call
      prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call
    };

    // let selectedFriendStatus = null;
    // this.props.active_friends.find(friend => {
    //   if (friend.outgoing_id === this.props.id) {
    //     selectedFriendStatus = friend.connected;
    //   }
    // });

    let screen = null;
    let startCall = null;
    let current_user = null;
    if (Platform.OS === "ios") {
      current_user = true;
    } else {
      current_user = false;
    }
    //checks if connected user and current user are both using ios
    //if (this.props.ios && this.props.user_ios && current_user) {
    if (this.props.iOS && current_user) {
      startCall = (
        <GotIt
          onPress={() => this.callOptions(number, args)}
          backgroundColor={colors.yellowColor}
          color="#333"
        >
          START CALL
        </GotIt>
      );
    } else {
      startCall = (
        <GotIt
          onPress={() => call(args).catch(console.error)}
          backgroundColor={colors.yellowColor}
          color="#333"
        >
          START CALL
        </GotIt>
      );
    }

    if (this.props.ui) {
      screen = (
        <View style={styles.indicator}>
          <ActivityIndicator color="#fff" />
        </View>
      );
    }
    if (this.props.ui === false && this.props.connected === true) {
      //call connected
      screen = (
        <View style={styles.successContainer}>
          <View>
            <Text style={styles.successText}>
              Woohoo! You've been connected with someone in your program. Start
              the call to find out who it is!
            </Text>
          </View>
          {startCall}
        </View>
      );
    }
    if (this.props.ui === false && this.props.connected === false) {
      screen = (
        <View style={styles.failContainer}>
          <Text style={styles.failText}>
            This call was connected with another person or has expired. Better
            luck next time.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          //backgroundColor={colors.greenColor}
        />
        {screen}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  indicator: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center"
  },
  successContainer: {
    backgroundColor: colors.greenColor,
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    padding: 40
  },
  failContainer: {
    //backgroundColor: colors.yellowColor,
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    padding: 40
  },
  successText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: Dimensions.get("window").width > 330 ? 28 : 24,
    color: "#fff",
    marginBottom: 40,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  failText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28,
    color: "#808080",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  deleteButton: {
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  return {
    ui: state.ui.isLoading,
    connected: state.active_groups.connected,
    phone_number: state.active_groups.phone_number,
    iOS: state.active_groups.iOS
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onJoinCall: id => dispatch(joinCall(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupDetail);
