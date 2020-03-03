import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert
} from "react-native";
import colors from "../../utils/styling";
import ActiveHelloButton from "../../components/UI/ActiveHelloButton";
import GotIt from "../../components/UI/GotItButton";
import Icon from "react-native-vector-icons/Ionicons";

import CountDown from "react-native-countdown-component";


const activePlan = props => {
  let times = [
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
  ];
  let activities = ["grab food", "hang out", "group study", "party"];
  let propActivity = [
    "Grab Food at",
    "Hang Out at",
    "Group Study at",
    "Party at"
  ];
  let title = `${propActivity[props.data.activity]} ${times[props.data.time]}`;

  if (props.data.exploding_offer_countdown > 3600) {
    countdown = (
      <CountDown
        until={props.data.exploding_offer_countdown}
        timeLabels={{ h: "", m: "", s: "" }}
        digitStyle={{ backgroundColor: colors.greenColor }}
        digitTxtStyle={{ color: "#ffffff" }}
        timeToShow={["H", "M", "S"]}
        onPress={() =>
          Alert.alert("Once time expires, you cannot join the plan.")
        }
        showSeparator={true}
        separator={":"}
        separatorStyle={{ color: "#fff" }}
        size={15}
        style={styles.countdown}
      />
    );
  } else {
    countdown = (
      <CountDown
        until={props.data.exploding_offer_countdown}
        timeLabels={{ m: "", s: "" }}
        digitStyle={{ backgroundColor: colors.greenColor }}
        digitTxtStyle={{ color: "#ffffff" }}
        timeToShow={["M", "S"]}
        onPress={() =>
          Alert.alert("Once time expires, you cannot join the plan.")
        }
        showSeparator={true}
        separator={":"}
        separatorStyle={{ color: "#fff" }}
        size={15}
        style={styles.countdown}
      />
    );
  }

  if (props.data.going) {
    buttonText = (
      <View>
        <View>
          <GotIt
            onPress={() => {
              props.onItemPressed(title);
            }}
            backgroundColor={colors.yellowColor}
            color="#333"
            fontSize={13}
          >
            OPEN GROUP CHAT
          </GotIt>
        </View>
        <View style={styles.inviteFriendsWrapper}>
          <GotIt
            onPress={() => {
              props.onInviteFriends()
            }}
            backgroundColor={colors.yellowColor}
            color="#333"
            fontSize={13}
          >
            INVITE FRIENDS
          </GotIt>
        </View>
      </View>
    );
  } else {
    buttonText = (
      <GotIt
        onPress={() => {
          Alert.alert(
            "Are you sure?",
            "Once you're in, you can't bail on the plan - don't leave your friends hanging! 👀",
            [
              {
                text: "Yes, I'm in!",
                onPress: () => props.onItemPressed(title),
                style: "default"
              },
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "default"
              }
            ],
            { cancelable: true }
          );
        }}
        backgroundColor={colors.yellowColor}
        color="#333"
        fontSize={13}
      >
        JOIN PLAN
      </GotIt>
    );
  }

  if (props.data.is_happening) {
    topRight = (
      <View style={styles.countDownRow}>
        <Text style={styles.planHappening}>
          Status: This plan is happening!
        </Text>
      </View>
    );
  } else {
    topRight = (
      <View style={styles.countDownRow}>
        <Text style={styles.timeLeftText}>Invite expires in:</Text>
        {countdown}
      </View>
    );
  }

  if (props.data.started_it) {
    started_it = (
      <Text style={styles.inviteText}>
        <Text style={styles.colorText}>You</Text> started a plan to {activities[props.data.activity]} at{" "}
        {times[props.data.time]} with {props.data.group_name}
      </Text>
    );
  } else {
    started_it = (
      <Text style={styles.inviteText}>
        <Text style={styles.colorText}>{props.data.plan_creator}</Text> invited you to{" "}
        {activities[props.data.activity]} at {times[props.data.time]} with{" "}
        {props.data.group_name}
      </Text>
    );
  }

  return (
    <View style={styles.planWrapper}>
      <View style={styles.borderStuff}>
        {topRight}
        <View style={styles.listItem}>
          {started_it}
          <View style={styles.imInButton}>
            {buttonText}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderStuff: { borderBottomWidth: 1, borderBottomColor: "#eee" },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 11,
    paddingTop: 0,
    flex: 1
  },
  inviteText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: Dimensions.get("window").width > 330 ? 18 : 17,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    letterSpacing: 1,
    width: "50%"
  },
  colorText: {
    color: colors.yellowColor,
    fontWeight: "700",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  placeButton: {
    // width: "50%",
    // flex: 1,
    // flexDirection: "row"
  },
  countdown: {
    // marginTop: 5
  },
  countDownRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 5
  },
  timeLeftText: {
    color: "#fff",
    margin: 6,
    marginRight: 0,
    fontWeight: "500"
  },
  planHappening: {
    color: "#fff",
    margin: 6,
    fontWeight: "500"
  },
  imInButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    // alignItems: "flex-end",
    width: "100%",
    // height: "100%",
    flex: 1,
    // marginTop: 5
  },
  inviteFriendsWrapper: {
    marginTop: 5,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  }
});

export default activePlan;
