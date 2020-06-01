import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Platform,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Linking,
  Button,
  PermissionsAndroid
} from "react-native";
import { connect } from "react-redux";
import CallStatus from "../../components/ActiveFriends/CallStatus";
import CallStatusGroups from "../../components/ActiveFriends/CallStatusGroups";
import { getActiveFriends } from "../../store/actions/activeFriends";
import { saveContacts } from "../../store/actions/userContacts"
import { getActivePlans, joinPlan } from "../../store/actions/activePlans";
import {
  getActiveGroups,
  joinGroupCall
} from "../../store/actions/activeGroups";
import colors from "../../utils/styling";
import firebase from "react-native-firebase";
import CallStatusCustomGroups from "../../components/ActiveFriends/CallStatusCustomGroups";
import ActivePlansList from "../../components/ActiveFriends/ActivePlansList";
import Contacts from 'react-native-contacts';


class ActiveFriendsScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
        ////////////////// permissions

        firebase
          .messaging()
          .hasPermission()
          .then(enabled => {
            if (enabled) {
              this.setState({
                androidNotificationsEnabled: true
              });
            } else {
              this.setState({
                androidNotificationsEnabled: false
              });
            }
          });

        firebase
          .messaging()
          .requestPermission()
          .then(() => {
            this.setState({
              notificationsEnabled: true
            });
          })
          .catch(error => {
            this.setState({
              notificationsEnabled: false
            });
          });

        //// end permissions
      }
    }
  };

  state = {
    notificationsEnabled: true,
    androidNotificationsEnabled: true
  };

  componentDidMount() {
    // this.props.onLoadActiveFriends();
    // this.props.onLoadActivePlans();
    // this.props.onLoadActiveGroups();
  }

  onClickFriend = (id, fullname, phone_number, ios) => {
    this.props.navigator.push({
      screen: "awesome-places.ConnectedStatusScreen",
      passProps: {
        id: id,
        fullname: fullname,
        phone_number: phone_number,
        ios: ios
      },
      backButtonTitle: ""
    });
  };

  onClickGroup = id => {
    this.props.onJoinGroupCall(id);
    this.props.navigator.push({
      screen: "awesome-places.ConnectedStatusGroupsScreen",
      backButtonTitle: ""
    });
  };

  onClickCustomGroup = (id, group_name, phone_number, ios) => {
    this.props.navigator.push({
      screen: "awesome-places.ConnectedStatusCustomGroupsScreen",
      passProps: {
        id: id,
        fullname: group_name,
        phone_number: phone_number,
        ios: ios
      },
      backButtonTitle: ""
    });
  };
  onClickPlan = (status, id, title) => {
    // alert(id);
    this.props.navigator.push({
      screen: "awesome-places.PlanChat",
      backButtonTitle: "",
      title: title,
      // title: "Residence Party at 9:00PM",
      passProps: {
        id: id
      }
    });

    if (!status) {
      this.props.onJoinPlan(id);
    }
  };

  // push to new screen 
  // "Andrew invited more friends to join" message in chat 
  // load contacts (show spinner) 
  //  -save contacts array in backend and send to frontend
  // show options to select friends 
  // 

  runContactSync = (status, id, title) => {
    this.getContacts()
    this.props.navigator.push({
      screen: "awesome-places.InviteFriends",
      backButtonTitle: ""
    });
  }

  getContacts = () => {
    if (Platform.OS === "ios") {
      Contacts.getAll((err, contacts) => {
        if (err) {
          throw err;
        }
        this.gotContacts(contacts)
      })
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'Wayvo would like to access your contacts.',
          'buttonPositive': 'Accept'
        }
      ).then(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            throw err;
          } else {
            this.gotContacts(contacts)
          }
        })
      })
    }
  }

  gotContacts = contacts => {
    console.log(contacts)
    this.props.onSaveContacts(contacts);
  }


  appSettings = () => {
    Linking.openURL("app-settings:");
    // change tab so when they come back, it refreshes
    this.props.navigator.switchToTab({
      tabIndex: 0
    });
  };

  static navigatorStyle = {
    navBarNoBorder: true,
    navBarBackgroundColor: colors.yellowColor,
    navBarButtonColor: "#ffffff",
    navBarHidden: true,
    statusBarColor: colors.greenColor
  };

  render() {
    //changes tab to active friends ifmsomeone is active
    if (
      this.props.active_friends.length +
      this.props.active_groups.length +
      this.props.active_custom_groups.length +
      this.props.active_plans.length >
      0
    ) {
      this.props.navigator.switchToTab({
        tabIndex: 3
      });
    }

    let activeExplain = null;

    if (
      this.state.notificationsEnabled &&
      this.state.androidNotificationsEnabled
    ) {
      if (
        this.props.active_friends.length < 1 &&
        this.props.active_custom_groups.length < 1 &&
        this.props.active_groups.length < 1 &&
        this.props.active_plans.length < 1
      ) {
        activeExplain = (
          <Text style={styles.activeExplain}>
            When friends or group members Say Hello or Start a Plan, they'll
            appear here for a few minutes.
            {/* Be the first to Say Hello Back to connect with them. */}
          </Text>
        );
      }
    } else {
      if (Platform.OS === "ios") {
        activeExplain = (
          <Text style={styles.activeExplain} onPress={this.appSettings}>
            Allow notifications{" "}
            <Text style={styles.notificationHere}>here </Text>
            if you want to be notified when friends and group members Say Hello
          </Text>
        );
      } else {
        activeExplain = (
          <Text style={styles.activeExplain}>
            Allow notifications in app settings if you want to be notified when
            friends and group members Say Hello
          </Text>
        );
      }
    }

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={
              this.props.isLoadingActivity || this.props.isLoadingPlans
            }
            onRefresh={() => {
              this.props.onLoadActiveFriends();
              this.props.onLoadActivePlans();
              this.props.onLoadActiveGroups();
            }}
          />
        }
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.greenColor}
        />
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.greenColor }}>
          {/* <OfflineNotice /> */}
          <View style={styles.friends}>
            <View style={styles.friendsHeaderWrapper}>
              <Text style={styles.friendsHeader}>Live Friends and Groups</Text>
            </View>
            <View style={styles.callStatusWrapper}>
              <CallStatus
                friends={this.props.active_friends}
                onItemSelected={this.onClickFriend}
                style={styles.friends}
              />
              <CallStatusGroups
                groups={this.props.active_groups}
                onItemSelected={this.onClickGroup}
                style={styles.friends}
              />
              <CallStatusCustomGroups
                custom_groups={this.props.active_custom_groups}
                onItemSelected={this.onClickCustomGroup}
                style={styles.friends}
              />
              <ActivePlansList
                active_plans={this.props.active_plans}
                onItemSelected={this.onClickPlan}
                onInviteFriendsSelected={this.runContactSync}
                style={styles.friends}
              />
            </View>
            {activeExplain}

            {/*
          Andrew Selvadurai invited you to grab food at 3:00PM with Fashion for Change 
          You have 3:21 to respond. 
          I'm in! => You're going 

          Be respectful of other people's time. Don't bail last minute (eye emoji)
           */}
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    active_friends: state.active_friends.active_friends,
    active_groups: state.active_groups.active_groups,
    active_plans: state.active_plans.active_plans,
    active_custom_groups: state.active_groups.active_custom_groups,
    isLoadingActivity: state.ui.isLoadingActivity,
    connected_with: state.outgoing.connected_with,
    isLoadingPlans: state.ui.isLoadingPlans
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadActiveFriends: () => dispatch(getActiveFriends()),
    onLoadActivePlans: () => dispatch(getActivePlans()),
    onLoadActiveGroups: () => dispatch(getActiveGroups()),
    onJoinGroupCall: id => dispatch(joinGroupCall(id)),
    onJoinPlan: id => dispatch(joinPlan(id)),
    onSaveContacts: contacts => dispatch(saveContacts(contacts))
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.greenColor,
    flex: 1
  },
  callStatusWrapper: {
    margin: 10,
    marginTop: 0,
    flex: 1
  },
  friendsHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    color: "#fff",
    //color: colors.yellowColor,
    fontWeight: "900",
    fontSize: 25,
    padding: 10,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
  },
  friendsHeaderWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    margin: 10,
    marginBottom: 0
  },
  activeExplain: {
    color: "#fff",
    fontSize: Dimensions.get("window").width > 330 ? 19 : 16,
    //textAlign: "center",
    flex: 1,
    //alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    fontWeight: "normal",
    paddingLeft: 20,
    paddingVertical: 10,
    paddingRight: 10,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    letterSpacing: 0.5
  },
  notificationHere: {
    color: colors.darkBlue,
    fontSize: Dimensions.get("window").width > 330 ? 19 : 16,
    //textAlign: "center",
    flex: 1,
    //alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    fontWeight: "700",
    paddingLeft: 20,
    paddingVertical: 10,
    paddingRight: 10,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    letterSpacing: 0.5
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveFriendsScreen);
