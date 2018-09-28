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
  StatusBar
} from "react-native";
import { connect } from "react-redux";
import call from "react-native-phone-call";
import { joinCall } from "../../store/actions/activeFriends";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

class FriendDetail extends Component {
  componentDidMount() {
    this.props.onJoinCall(this.props.id);
  }

  static navigatorStyle = {
    drawUnderNavBar: true,
    navBarTransparent: true,
    navBarTranslucent: Platform.OS === "ios" ? true : false,
    topBarElevationShadowEnabled: false,
    navBarButtonColor: "#000"
    //navBarBackgroundColor: "transparent"
  };
  constructor(props) {
    super(props);
  }

  render() {
    let number = this.props.phone_number;
    const args = {
      number: number, // String value with the number to call
      prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call
    };

    let selectedFriendStatus = null;
    this.props.active_friends.find(friend => {
      if (friend.outgoing_id === this.props.id) {
        selectedFriendStatus = friend.connected;
      }
    });

    let screen = null;
    if (this.props.ui) {
      screen = (
        <View style={styles.indicator}>
          <ActivityIndicator />
        </View>
      );
    }
    if (this.props.ui === false && selectedFriendStatus === true) {
      //call connected
      screen = (
        <View style={styles.successContainer}>
          <View>
            <Text style={styles.successText}>
              WOOHOO! You've been connected with {"\n"}
              {this.props.fullname}.
            </Text>
          </View>
          <GotIt
            onPress={() => call(args).catch(console.error)}
            backgroundColor={colors.yellowColor}
            color="#333"
          >
            START CALL
          </GotIt>
        </View>
      );
    }
    if (this.props.ui === false && selectedFriendStatus === false) {
      screen = (
        <View style={styles.failContainer}>
          <StatusBar barStyle="dark-content" />
          <Text style={styles.failText}>
            Sorry, this call was connected with another person or has expired.
            Better luck next time 😭
          </Text>
        </View>
      );
    }
    return <View style={styles.container}>{screen}</View>;
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
    fontSize: 28,
    color: "#fff",
    marginBottom: 40
  },
  failText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28
  },
  deleteButton: {
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  return {
    ui: state.ui.isLoading,
    active_friends: state.active_friends.active_friends
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
)(FriendDetail);
