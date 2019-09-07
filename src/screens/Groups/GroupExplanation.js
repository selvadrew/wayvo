import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Platform,
  StatusBar,
  SafeAreaView,
  Image,
  Button,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import DropdownAlert from "react-native-dropdownalert";
import GotIt from "../../components/UI/GotItButton";
import { getUniversities } from "../../store/actions/groups";

class GroupsExplanation extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  onJoinGroups = () => {
    this.props.onGetUniversities();
  };

  //  <Text>Who share your interests (ex. Entrepreneurship)</Text>
  render() {
    let joinButton = null;
    if (this.props.isLoadingGroups) {
      joinButton = <ActivityIndicator color="#fff" />;
    } else {
      joinButton = (
        <GotIt
          onPress={() => this.onJoinGroups()}
          backgroundColor={colors.yellowColor}
          color="#333"
          fontSize={18}
        >
          JOIN MY UNIVERSITY
        </GotIt>
      );
    }

    // old
    // Every time you press "Make a new friend", Wayvo Groups connects you on
    // a call with someone new in your program of study or school club you're
    // part of. After you connect, you can add them to your Friends list to
    // connect again.

    //Are you in university? Join Wayvo Groups to connect with someone new in
    //your program of study, the school clubs you're part of, or who has the same interests as you
    //Every time you press "Make a new friend", you'll get connected to someone at your university from one of the three groups above.
    //After you connect, you can add them to your Friends list to connect again.
    //Get verified to join groups at your school.
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Make New Friends Everyday</Text>
        {/* <Text style={styles.subTitle}>Make New Friends Everyday</Text> */}
        {/* <Text style={styles.paragrapgh}>
          Are you in university? Join Wayvo Groups to connect with someone new
          at your university
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} from your program of study {"\n"}
          {"\u2022"} from school clubs you can join{"\n"}
          {"\u2022"} with the same interests
        </Text>
        <Text style={styles.paragrapgh}>
          After you connect, add them to your Friends list to connect again.
        </Text> */}
        <Text style={styles.paragrapgh}>
          Press <Text style={styles.yellowText}>Start a Plan</Text> and choose to start a party 🎉 with your residence building. Wayvo will send a notification to all the students in your residence 🏢 to let them know they're invited to your party. Wayvo, then automatically starts a group chat 💬 with everyone coming to your party, so you can finalize the party details together 🙌
        </Text>
        <Text style={styles.paragrapgh}>
          The next day ☀️ while walking 🚶‍ to class, press <Text style={styles.yellowText}>Make a New Friend</Text> to meet someone new from your program over a video call 📳
        </Text>
        {/* <Text style={styles.paragrapgh}>
          Or just press <Text style={styles.yellowText}>Catch up with a friend</Text> to reconnect with a friend you met last month through Wayvo
        </Text> */}

        <View style={styles.verifyButton}>{joinButton}</View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.users.username,
    isLoadingGroups: state.ui.isLoadingGroups
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetUniversities: () => dispatch(getUniversities())
  };
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: "column"
  },
  title: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontSize: 24
  },
  subTitle: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontSize: 25
  },
  paragrapgh: {
    color: "#fff",
    fontSize: 21,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    marginTop: 20,
    fontWeight: "400",
    letterSpacing: 0.5
  },
  verifyButton: {
    marginTop: 40
  },
  bulletPoint: {
    color: "#fff",
    fontSize: 21,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontWeight: "400",
    paddingLeft: 20,
    marginTop: 10
  },
  yellowText: {
    fontWeight: "800",
    color: colors.yellowColor
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsExplanation);
