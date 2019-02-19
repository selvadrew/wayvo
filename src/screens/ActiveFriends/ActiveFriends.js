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
  StatusBar
} from "react-native";
import { connect } from "react-redux";
import CallStatus from "../../components/ActiveFriends/CallStatus";
import CallStatusGroups from "../../components/ActiveFriends/CallStatusGroups";
import { getActiveFriends } from "../../store/actions/activeFriends";
import {
  getActiveGroups,
  joinGroupCall
} from "../../store/actions/activeGroups";
import colors from "../../utils/styling";

class ActiveFriendsScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onLoadActiveFriends();
    this.props.onLoadActiveGroups();
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
      this.props.active_friends.length + this.props.active_groups.length >
      0
    ) {
      this.props.navigator.switchToTab({
        tabIndex: 3
      });
    }

    let activeExplain = null;

    if (
      this.props.active_groups.length + this.props.active_friends.length ===
      0
    ) {
      activeExplain = (
        <Text style={styles.activeExplain}>
          When friends or group members Say Hello, they'll appear here until
          time expires. Say Hello Back to start a call with them.
          {/* Be the first to Say Hello Back to connect with them. */}
        </Text>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isLoadingActivity}
            onRefresh={() => {
              this.props.onLoadActiveFriends();
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
            </View>
            {activeExplain}
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
    isLoadingActivity: state.ui.isLoadingActivity,
    connected_with: state.outgoing.connected_with
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadActiveFriends: () => dispatch(getActiveFriends()),
    onLoadActiveGroups: () => dispatch(getActiveGroups()),
    onJoinGroupCall: id => dispatch(joinGroupCall(id))
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
    fontFamily: Platform.OS === "android" ? "Roboto" : null
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
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveFriendsScreen);
