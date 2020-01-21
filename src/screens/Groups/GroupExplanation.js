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
  Dimensions,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import DropdownAlert from "react-native-dropdownalert";
import GotIt from "../../components/UI/GotItButton";
import { getUniversities, getPrograms } from "../../store/actions/groups";

class GroupsExplanation extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  onJoinGroups = () => {
    return AsyncStorage.multiGet(["university_id", "universityName"]).then(
      response => {
        this.props.onGetPrograms(parseInt(response[0][1]), response[1][1])
      }
    );
    // this.props.onGetUniversities();
  };

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

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Make New Friends Every Day</Text>
        <Text style={styles.paragrapgh}>
          {/* Join your university to receive a notification when
          students from your program, residence, school club, or cultural group
          start a plan to grab food on campus.
          If you decide to join the plan, Wayvo will automatically add you to a group chat with everyone that's going. */}
          When students from your program, residence, school club, or cultural group
          start a plan to grab food on campus, you'll get an invitation to attend.
          If you accept the invitation, Wayvo will add you into a group chat with everyone that's going.
        </Text>
        <Text style={styles.paragrapgh}>
          That's not it though, check out "start a plan" and "make a new friend" <Text style={styles.here} onPress={() => this.props.onPresss()}>here</Text> to see what else you'll have access to.
        </Text>
        <Text style={styles.paragrapgh}>
          Unlike other social media apps,
          Wayvo helps you connect with amazing humans in real life, helping you live a happier life.
        </Text>
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
    onGetPrograms: (id, value) => dispatch(getPrograms(id, value))
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
    marginTop: 30
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
  },
  here: {
    textDecorationLine: "underline"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsExplanation);