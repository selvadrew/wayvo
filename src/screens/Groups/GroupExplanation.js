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
        <Text style={styles.title}>Make a New Friend</Text>
        <Text style={styles.subTitle}>Wayvo Groups</Text>
        <Text style={styles.paragrapgh}>
          Are you in university? Join Wayvo Groups to connect with someone new
          at your university
        </Text>
        <Text style={styles.bulletPoint}>
          {"\u2022"} from your program of study {"\n"}
          {"\u2022"} from the school clubs you're in{"\n"}
          {"\u2022"} with the same interests
        </Text>
        <Text style={styles.paragrapgh}>
          After you connect, add them to your Friends list to connect again.
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
    color: colors.yellowColor,
    textAlign: "center",
    fontWeight: "800",
    fontSize: 25
  },
  subTitle: {
    color: colors.yellowColor,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 18
  },
  paragrapgh: {
    color: "#fff",
    fontSize: 21,
    marginTop: 20,
    fontWeight: "400"
  },
  verifyButton: {
    marginTop: 40
  },
  bulletPoint: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "400",
    paddingLeft: 20,
    marginTop: 10
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsExplanation);
