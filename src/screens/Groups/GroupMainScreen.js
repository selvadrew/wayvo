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
  Alert
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import DropdownAlert from "react-native-dropdownalert";
import GotIt from "../../components/UI/GotItButton";
import AddButton from "../../components/UI/AddButton";
import GroupsList from "../../components/GroupsList/GroupsList";
import { getConnectedUsers } from "../../store/actions/groups";

class GroupMainScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  groupsSelectedHandler = id => {
    this.props.getConnectedUsers(id);

    this.props.navigator.push({
      screen: "awesome-places.GroupSelectedScreen",
      backButtonTitle: ""
    });
  };

  render() {
    return (
      <View>
        <View style={styles.container2}>
          <View style={styles.friends2}>
            <View style={styles.friendsHeaderWrapper2}>
              <Text style={styles.friendsHeader2}>Groups</Text>
              <AddButton
                onPress={() =>
                  Alert.alert(
                    "You cannot currently join or create new groups",
                    `It will be available soon at the ${
                      this.props.enrolledUniversity
                    }.`
                  )
                }
              />
            </View>
          </View>
          <GroupsList
            groups={this.props.userGroups}
            onItemSelected={this.groupsSelectedHandler}
          />
          {/* <View style={styles.uniWrapper}>
            <Text style={styles.uniName}>{this.props.enrolledUniversity}</Text>
          </View> */}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoadingGroups: state.ui.isLoadingGroups,
    userGroups: state.groups.userGroups,
    enrolledUniversity: state.groups.enrolledUniversity
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getConnectedUsers: program_id => dispatch(getConnectedUsers(program_id))
  };
};

const styles = StyleSheet.create({
  container2: {
    padding: 20,
    paddingTop: 10,
    flex: 1,
    flexDirection: "column"
  },
  friends2: {
    //margin: 10
    //marginHorizontal: 20
  },
  friendsHeader2: {
    // flexDirection: "row",
    // alignItems: "center",
    // width: "100%",
    color: colors.yellowColor,
    fontWeight: "900",
    fontSize: 25,
    padding: 10,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  friendsHeaderWrapper2: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  uniName2: {
    textAlign: "center",
    color: colors.darkBlue,
    padding: 10,
    fontSize: 20,
    fontWeight: "500"
  },
  uniWrapper2: {
    marginHorizontal: 20
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupMainScreen);
