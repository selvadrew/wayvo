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
        <Text style={styles.title}>Make New Friends Everyday</Text>
        <Text style={styles.paragrapgh}>
          Join your university to grab food, group study, hang out, and party with students from
          your program, residence,
          school clubs, interest groups, and friend groups.
        </Text>
        <Text style={styles.paragrapgh}>
          Wayvo makes it easy to make plans on the fly with new and existing friends every day. For example, someone can create a plan at 10 AM to grab food with everyone in your program at 1 PM.
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
