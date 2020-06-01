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
import { Dropdown } from 'react-native-material-dropdown';

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

  state = {
    learnMoreIndex: null
  };

  onChangeTextPress = (value, index) => {
    this.setState({
      learnMoreIndex: index
    })
  }

  render() {
    let data = [{
      value: 'Start a plan ',
    }, {
      value: 'Make a new friend ',
    }, {
      value: 'Catch up with a friend ',
    }, {
      value: 'Groups ',
    }, {
      value: 'Live ',
    }];

    let learnMoreText = null
    switch (this.state.learnMoreIndex) {
      case 0://start a plan 
        learnMoreText = (
          <View>
            <Text style={styles.learnMoreText}>
              Plans can be started with students from your program, residence, school club, cultural group, interest group, or friend groups.
            </Text>
            <Text style={styles.learnMoreText2}>
              Once you select a group, you can <Text style={styles.toGroupsText}>start a plan</Text> to grab food, group study, hang out, or party. Wayvo will notify everyone in the group and automatically create a group chat with all the students who want to join the plan, so you can all finalize the details together before meeting up.
            </Text>
            <Text style={styles.learnMoreText2}>
              Starting a plan is the best way to make new friends and connect with existing friends in-person every day.
            </Text>
            <Text style={styles.learnMoreText3}>
              Note: You can only start or join plans with groups you're in. Learn more about Wayvo <Text style={styles.toGroupsText}>groups</Text> by selecting it above.
            </Text>
          </View>
        )
        break
      case 1://make a new friend
        learnMoreText = (
          <View>
            <Text style={styles.learnMoreText}>
              You can <Text style={styles.toGroupsText}>make a new friend</Text>{" "}
              over a voice or video call from your program, residence, school club, cultural group, interest group, or mutual friend groups.
          </Text>
            <Text style={styles.learnMoreText2}>
              For example, if you choose to make a new friend from your program,
                  Wayvo will notify everyone in your program you haven't - the first one to respond gets to call you.
          </Text>
            <Text style={styles.learnMoreText2}>
              It's the best way to make a new friend when you have some spare time, like when you're commuting to school or taking a study break.
          </Text>
            <Text style={styles.learnMoreText3}>
              Note: You can only make a new friend from groups you're in. Learn more about Wayvo <Text style={styles.toGroupsText}>groups</Text> by selecting it above.
          </Text>
          </View>
        )
        break
      case 2://catch up with a friend 
        learnMoreText = (
          <View>
            <Text style={styles.learnMoreText}>
              Don't lose touch with the awesome people you meet through the <Text style={styles.toGroupsText}>start a plan</Text> or <Text style={styles.toGroupsText}>make a new friend</Text> features. After you meet people in person or over a call, add them to your Friends List.
            </Text>
            <Text style={styles.learnMoreText2}>
              When you press <Text style={styles.toGroupsText}>catch up with a friend</Text>, it's like saying hello to all your friends at once. We'll send everyone on your Friends List a notification and the first one to respond gets to call you.
            </Text>
            <Text style={styles.learnMoreText2}>
              It's a great way to check up on a friend or make their day.
            </Text>
          </View>
        )
        break
      case 3://groups
        learnMoreText = (
          <View>
            <Text style={styles.learnMoreText}>
              When you get verified at your school, you automatically get added to two groups - your program and graduating class.
              You'll be able to <Text style={styles.toGroupsText}>make a new friend</Text> or <Text style={styles.toGroupsText}>start a plan</Text> with other verified members from these groups.
            </Text>

            <Text style={styles.learnMoreText2}>
              It’ll be up to you to find more groups you want to join,
              or to create your own group to bring friends or people with similar interests together (e.g., entrepreneurship). If you create your own group, let others know through social media so they can join.
            </Text>
          </View>
        )
        break
      case 4://Live
        learnMoreText = (
          <View>
            <Text style={styles.learnMoreText}>
              The Live screen is where you'll see group members and friends when they press{" "}
              <Text style={styles.toGroupsText}>start a plan</Text>, <Text style={styles.toGroupsText}>make a new friend</Text>, or <Text style={styles.toGroupsText}>catch up with a friend</Text>.
            </Text>
            <Text style={styles.learnMoreText2}>
              When you receive a notification, quickly go to the Live screen, so you can join a plan or get connected on a call before it's too late.
            </Text>
          </View>
        )
        break
      default:
        learnMoreText = null
        break
    }

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <View style={styles.wrapper}>
          <Text style={styles.header}>
            Wayvo helps university students connect with new and existing friends every day.
          </Text>
          <Dropdown
            label='Select a feature to learn more '
            data={data}
            itemCount={5}
            itemColor="#333"
            baseColor={colors.darkBlue}
            textColor="#333"
            onChangeText={(value, index) => this.onChangeTextPress(value, index)}
            dropdownPosition={0}
          />
          <View style={styles.learnMoreTextWrapper}>
            {learnMoreText}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 15
  },
  wrapper: {
    flex: 1,
    // alignContent: "center",
    // justifyContent: "center",
    marginBottom: 10
  },
  header: {
    fontSize: Dimensions.get("window").width > 330 ? 21 : 18,
    color: "#444",
    fontWeight: "500",
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    letterSpacing: 0.5
  },
  learnMoreText: {
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    fontSize: 18,
    letterSpacing: 0.5,
    color: "#333",
  },
  learnMoreText2: {
    marginTop: 10,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    fontSize: 18,
    letterSpacing: 0.5,
    color: "#333",
  },
  learnMoreText3: {
    marginTop: 10,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    fontSize: 13,
    letterSpacing: 0.5,
    color: "#444",
    marginBottom: 30
  },
  toGroupsText: {
    color: colors.blueColor
  },
  learnMoreTextWrapper: {
    marginTop: 10
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
