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
  AsyncStorage,
  Alert
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";

import GroupExplanation from "./GroupExplanation";
import GroupsUploadPicture from "./GroupUploadPicture";
import GroupSelectUniversity from "./GroupSelectUniversity";
import GroupFinishedApplication from "./GroupFinishedApplication";
import { changeGroupState, getUserGroups } from "../../store/actions/groups";
import { getAllCustomGroupData } from "../../store/actions/customGroups";
import { getUserInfo } from "../../store/actions/users";

import DropdownAlert from "react-native-dropdownalert";
import GotIt from "../../components/UI/GotItButton";
import AddButton from "../../components/UI/AddButton";
import GroupsList from "../../components/GroupsList/GroupsList";
import { getConnectedUsers } from "../../store/actions/groups";

class GroupsScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }
  // once verified, itll show verified even if app loads with no internet
  componentDidMount() {
    return AsyncStorage.multiGet(["pp:verified", "pp:submitted", "university_id"]).then(
      response => {
        if (response[0][1] === "true") {
          this.setState({
            verified: true
          });
        }
        if (response[1][1] === "true") {
          this.setState({
            submitted: true
          });
        }
      }
    );
  }

  groupsSelectedHandler = (id, value, type, secretUsername) => {
    //check if program group or custom group
    if (type) {
      this.props.getAllCustomGroupData(id);
      this.props.navigator.push({
        screen: "awesome-places.CustomGroupSelectedScreen", //customgroupdetail screen
        backButtonTitle: "",
        title: secretUsername,
        passProps: {
          secretUsername: secretUsername
        }
      });
    } else {
      this.props.getConnectedUsers(id);

      this.props.navigator.push({
        screen: "awesome-places.GroupSelectedScreen", //groupdetail screen
        backButtonTitle: "",
        title: value
      });
    }
  };

  howItWorksScreen = () => {
    this.props.navigator.push({
      screen: "awesome-places.HowItWorks",
      backButtonTitle: ""
    });
  };

  state = {
    verified: null,
    submitted: null,
    hackLoading: false
  };

  render() {
    let realScreen = null;
    let groupCreateJoinAlert = null;
    let groupSortedList = null;

    if (this.props.userGroups) {
      groupSortedList = (
        <GroupsList
          groups={this.props.userGroups}
          onItemSelected={this.groupsSelectedHandler}
        />
      );
    } else {
      groupSortedList = (
        <ActivityIndicator size="small" color="#fff" marginTop={10} />
      );
    }

    if (Platform.OS === "ios") {
      groupCreateJoinAlert = (
        <AddButton
          onPress={() =>
            Alert.alert(
              `Join or create groups within the ${
              this.props.enrolledUniversity
              } community`,
              "",
              [
                {
                  text: "Join a group",
                  onPress: () =>
                    this.props.navigator.push({
                      screen: "awesome-places.JoinGroupScreen",
                      backButtonTitle: ""
                    })
                },
                {
                  text: "Create a group",
                  onPress: () =>
                    this.props.navigator.push({
                      screen: "awesome-places.CreateGroupScreen",
                      backButtonTitle: ""
                    })
                },
                {
                  text: "Never mind",
                  onPress: () => console.log("cancel")
                }
              ],
              { cancelable: true }
            )
          }
        />
      );
    } else {
      groupCreateJoinAlert = (
        <AddButton
          onPress={() =>
            Alert.alert(
              `Join or create groups within the ${
              this.props.enrolledUniversity
              } community`,
              "",
              [
                {
                  text: "Never mind",
                  onPress: () => console.log("cancel")
                },
                {
                  text: "Create a group",
                  onPress: () =>
                    this.props.navigator.push({
                      screen: "awesome-places.CreateGroupScreen",
                      backButtonTitle: ""
                    })
                },
                {
                  text: "Join a group",
                  onPress: () =>
                    this.props.navigator.push({
                      screen: "awesome-places.JoinGroupScreen",
                      backButtonTitle: ""
                    })
                }
              ],
              { cancelable: true }
            )
          }
        />
      );
    }
    realScreen = (
      <View>
        <View style={styles.container2}>
          <View style={styles.friends2}>
            <View style={styles.friendsHeaderWrapper2}>
              <Text style={styles.friendsHeader2}>Groups</Text>
              {groupCreateJoinAlert}
            </View>
          </View>
          {groupSortedList}
          {/* <View style={styles.uniWrapper}>
            <Text style={styles.uniName}>{this.props.enrolledUniversity}</Text>
          </View> */}
        </View>
      </View>
    );

    let screen = null;
    let refresh = null;
    let checkVerified = (
      <RefreshControl
        refreshing={this.state.hackLoading}
        onRefresh={() => {
          //fake loader
          this.setState({
            hackLoading: true
          });
          setTimeout(() => {
            this.setState({
              hackLoading: false
            });
          }, 1000);

          if (Platform.OS === "ios") {
            this.props.getUserInfo(true);
          } else {
            this.props.getUserInfo(false);
          }
          this.props.getUserGroups();
        }}
      />
    );
    let realLoading = (
      <RefreshControl
        refreshing={this.props.isLoadingGroups}
        onRefresh={() => {
          this.props.getUserGroups();
        }}
      />
    );
    if (this.state.verified || this.props.verified === true) {
      screen = realScreen;
      refresh = realLoading;
    } else {
      if (
        this.props.submitted ||
        (this.props.submitted === null && this.state.submitted) // if not connected to internet and is submitted
      ) {
        screen = <GroupFinishedApplication />;
        refresh = checkVerified;
      } else {
        if (this.props.group_state === 0) {
          screen = <GroupExplanation
            onPresss={() => this.howItWorksScreen()}
          />;
        } else if (this.props.group_state === 2) {
          screen = <GroupsUploadPicture />;
        } else if (this.props.group_state === 1) {
          screen = <GroupSelectUniversity />;
        } else if (this.props.group_state === 3) {
          screen = <GroupFinishedApplication />;
          refresh = checkVerified;
        }
      }
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        style={styles.container}
        refreshControl={refresh}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.blueColor }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.blueColor}
          />
          {screen}
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    group_state: state.groups.group_state,
    submitted: state.users.submitted,
    verified: state.users.verified,
    isLoadingGroups: state.ui.isLoadingGroups,
    userGroups: state.groups.userGroups,
    enrolledUniversity: state.groups.enrolledUniversity
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeGroupState: position => dispatch(changeGroupState(position)),
    getUserInfo: ios => dispatch(getUserInfo(ios)),
    getConnectedUsers: program_id => dispatch(getConnectedUsers(program_id)),
    getUserGroups: () => dispatch(getUserGroups()),
    getAllCustomGroupData: id => dispatch(getAllCustomGroupData(id))
  };
};

const styles = StyleSheet.create({
  container: {
    //padding: 20,
    backgroundColor: colors.blueColor,
    width: "100%"
  },
  placeholder: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#eee",
    // width: "100%",
    height: Dimensions.get("window").width
  },
  button: {
    margin: 8
  },
  previewImage: {
    width: "100%",
    height: Dimensions.get("window").width,
    resizeMode: "contain"
  },
  searchBar: {
    width: "100%"
  },
  friendRequests: {
    margin: 20,
    marginTop: 40
  },
  friends: {
    margin: 20
  },
  friendsHeader: {
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
  friendsHeaderWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  requestsHeader: {
    color: colors.yellowColor
  },
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
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontWeight: "500"
  },
  uniWrapper2: {
    marginHorizontal: 20
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsScreen);

// When someone adds you as a friend, they will not know if you accepted or rejected their request.
