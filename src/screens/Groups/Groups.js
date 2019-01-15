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

import {
  addFriend,
  getFriends,
  getFriendRequests,
  refreshFriendRequests,
  rejectFriend,
  friendsFromStorage
} from "../../store/actions/friends";

import GroupExplanation from "./GroupExplanation";
import GroupsUploadPicture from "./GroupUploadPicture";
import GroupSelectUniversity from "./GroupSelectUniversity";
import GroupFinishedApplication from "./GroupFinishedApplication";

class GroupsScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  state = {
    // applicationStep: 0
  };

  handleChildClick = () => {
    alert("hi");
  };

  render() {
    //would check if verified or submitted is true
    //if verified or submitted show none of the beloce
    //if not verified and submitted, show submitted screen instead

    let screen = null;
    if (this.props.group_state === 0) {
      screen = <GroupExplanation />;
    } else if (this.props.group_state === 1) {
      screen = <GroupsUploadPicture />;
    } else if (this.props.group_state === 2) {
      screen = <GroupSelectUniversity />;
    } else if (this.props.group_state === 3) {
      screen = <GroupFinishedApplication />;
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        style={styles.container}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={this.props.isLoading}
        //     onRefresh={() => this.props.onLoadFriendRequests()}
        //   />
        // }
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
    group_state: state.groups.group_state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCheckUsername: username => dispatch(addFriend(username)),
    onLoadFriends: () => dispatch(getFriends()),
    friendsFromStorage: () => dispatch(friendsFromStorage()),
    onLoadFriendRequests: () => dispatch(getFriendRequests()),
    onRefreshRequests: username => dispatch(refreshFriendRequests(username)),
    onRejectFriend: id => dispatch(rejectFriend(id))
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsScreen);

// When someone adds you as a friend, they will not know if you accepted or rejected their request.
