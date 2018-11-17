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
import { getActiveFriends } from "../../store/actions/activeFriends";
import colors from "../../utils/styling";
import OfflineNotice from "../../screens/OfflineNotice/OfflineNotice";

class ActiveFriendsScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onLoadActiveFriends();
  }

  onClickFriend = (id, fullname, phone_number) => {
    this.props.navigator.push({
      screen: "awesome-places.ConnectedStatusScreen",
      passProps: {
        id: id,
        fullname: fullname,
        phone_number: phone_number
      },
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
    // changes tab to active friends ifmsomeone is active
    // if (this.props.active_friends.length > 0) {
    //   this.props.navigator.switchToTab({
    //     tabIndex: 2
    //   });
    // }

    let activeExplain = null;

    if (
      // this.props.connected_with === null &&
      this.props.active_friends.length < 1
    ) {
      activeExplain = (
        <Text style={styles.activeExplain}>
          When contacts Say Hello, you can Say Hello Back on this screen
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
            onRefresh={() => this.props.onLoadActiveFriends()}
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
              <Text style={styles.friendsHeader}>Active Contacts</Text>
            </View>
            <CallStatus
              friends={this.props.active_friends}
              onItemSelected={this.onClickFriend}
              style={styles.friends}
            />
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
    isLoadingActivity: state.ui.isLoadingActivity,
    connected_with: state.outgoing.connected_with
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadActiveFriends: () => dispatch(getActiveFriends())
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.greenColor,
    flex: 1
  },
  friends: {
    margin: 10,
    marginTop: Platform.OS === "ios" ? 10 : 10,
    flex: 1
  },
  friendsHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    color: "#fff",
    fontWeight: "900",
    fontSize: 25,
    padding: 10
  },
  friendsHeaderWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  activeExplain: {
    color: "#fff",
    fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
    textAlign: "center",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    fontWeight: "normal",
    padding: 5
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveFriendsScreen);
