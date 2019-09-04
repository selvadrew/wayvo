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

import { changeGroupState } from "../../store/actions/groups";
import Icon from "react-native-vector-icons/Ionicons";

class GroupFinishedApplication extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.subTitle}>Status: Waiting for Approval</Text>
        {/* <View>
          <Icon
            size={70}
            name="ios-checkmark-circle-outline"
            color={colors.greenColor}
          />
        </View> */}
        <Text style={styles.paragrapgh}>
          {/* Thank you for your submission, you will receive a notification once
          your profile is approved. If you have any questions or concerns let us
          know in the feedback section. */}
          Thank you for your submission, check back in 24 hours(pull down to
          refresh the screen).
          {"\n"}
          {"\n"}
          Once approved, you will be able to start and join
          plans with other students from your university, program, school clubs, interest groups, etc..
          You can start a plan to grab food, hangout, group study, or party!
        </Text>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.users.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeGroupState: position => dispatch(changeGroupState(position))
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
    fontSize: 23
  },
  paragrapgh: {
    color: "#fff",
    fontSize: 21,
    marginTop: 20,
    fontWeight: "500"
  },
  bulletPoint: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "500",
    paddingLeft: 20,
    marginTop: 10
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupFinishedApplication);

// When someone adds you as a friend, they will not know if you accepted or rejected their request.
