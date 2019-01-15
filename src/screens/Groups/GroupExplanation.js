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
import { changeGroupState } from "../../store/actions/groups";

class GroupsExplanation extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  //  <Text>Who share your interests (ex. Entrepreneurship)</Text>
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Wayvo University Groups</Text>
        <Text style={styles.paragrapgh}>
          Every time you press "Make a new friend", Wayvo Groups connects you on
          a call with someone new in your program of study or school club you're
          part of. After you connect, you can add them to your Friends list to
          connect again.
        </Text>
        {/* <Text style={styles.paragrapgh}>
          After you connect, you can add them to your Friends list to connect
          again. Get verified to join groups within your school.
        </Text> */}
        {/* <Text style={styles.paragrapgh}>
          When you join a group, you'll be able to connect once with every
          member of that group. After you connect, you can add them to your
          Friends list to connect again. Get verified to join groups within your
          school.
        </Text> */}

        <View style={styles.verifyButton}>
          <GotIt
            onPress={() => this.props.onChangeGroupState(1)}
            backgroundColor={colors.yellowColor}
            color="#333"
          >
            JOIN GROUPS
          </GotIt>
        </View>
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
    //textAlign: "center",
    fontWeight: "800",
    fontSize: 25
  },
  paragrapgh: {
    color: "#fff",
    fontSize: 21,
    marginTop: 20,
    fontWeight: "500"
  },
  verifyButton: {
    marginTop: 40
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsExplanation);
