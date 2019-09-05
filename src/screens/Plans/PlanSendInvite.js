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
  TouchableOpacity,
  Picker
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

import { setTimeForPlan, sendInvite } from "../../store/actions/plans";

class PlanSendInvite extends Component {
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

  state = {
    explodingOffers: [
      "5 minutes",
      "10 minutes",
      "30 minutes",
      "1 hour",
      "4 hours"
    ],
    activities: ["grab food", "hang out", "group study", "party"],
    times: [
      "12:00AM",
      "12:30AM",
      "1:00AM",
      "1:30AM",
      "2:00AM",
      "2:30AM",
      "3:00AM",
      "3:30AM",
      "4:00AM",
      "4:30AM",
      "5:00AM",
      "5:30AM",
      "6:00AM",
      "6:30AM",
      "7:00AM",
      "7:30AM",
      "8:00AM",
      "8:30AM",
      "9:00AM",
      "9:30AM",
      "10:00AM",
      "10:30AM",
      "11:00AM",
      "11:30AM",
      "12:00PM",
      "12:30PM",
      "1:00PM",
      "1:30PM",
      "2:00PM",
      "2:30PM",
      "3:00PM",
      "3:30PM",
      "4:00PM",
      "4:30PM",
      "5:00PM",
      "5:30PM",
      "6:00PM",
      "6:30PM",
      "7:00PM",
      "7:30PM",
      "8:00PM",
      "8:30PM",
      "9:00PM",
      "9:30PM",
      "10:00PM",
      "10:30PM",
      "11:00PM",
      "11:30PM"
    ]
  };

  timeSelected = index => {
    this.props.onSetTimeForPlan(index);

    this.props.navigator.push({
      screen: "awesome-places.PlanExplodingOffer",
      backButtonTitle: "",
      title: "Set Exploding Offer",
      passProps: {
        timeTillPlan: Math.floor(
          (new Date().setHours(index / 2, (index % 2) * 30, 0) - new Date()) /
          60000
        )
      }
    });
  };

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <View>
          <Text style={styles.header}>
            Hey {this.props.groupName} members, who’s down to{" "}
            {this.state.activities[this.props.activity]} at{" "}
            {this.state.times[this.props.time]}? If 3 or more members are in
            within {this.state.explodingOffers[this.props.explodingOffer]}, it's
            on!
          </Text>
          <GotIt
            onPress={() => {
              this.props.navigator.popToRoot();
              setTimeout(() => {
                this.props.onSendInvite(
                  this.props.groupType,
                  this.props.groupId,
                  this.props.activity,
                  this.props.time,
                  this.props.explodingOffer
                );
                this.props.navigator.switchToTab({
                  tabIndex: 3
                });
              }, 200);
            }}
            backgroundColor={colors.orange}
            color="#333"
            fontSize={18}
            width="60%"
          >
            SEND INVITE
          </GotIt>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  header: {
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    color: "#111",
    fontWeight: "400",
    padding: 18,
    letterSpacing: 0.6,
    marginTop: 10,
    // textAlign: "center",
    marginTop: 10
  },
  viewWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  buttonWrapper: {
    backgroundColor: colors.orange,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    padding: 10,
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    color: "#333",
    letterSpacing: 1,
    fontWeight: "500"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onSetTimeForPlan: time => dispatch(setTimeForPlan(time)),
    onSendInvite: (groupType, groupId, activity, time, explodingOffer) =>
      dispatch(sendInvite(groupType, groupId, activity, time, explodingOffer))
  };
};

const mapStateToProps = state => {
  return {
    groupType: state.plans.groupType,
    groupId: state.plans.groupId,
    groupName: state.plans.groupName,
    activity: state.plans.activity,
    time: state.plans.time,
    explodingOffer: state.plans.explodingOffer
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlanSendInvite);
