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
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";

import FriendsList from "../../components/FriendsList/FriendsList";
import FriendRequests from "../../components/FriendsList/FriendRequests";

import SearchBar from "../../components/SearchBar/SearchBar";
import colors from "../../utils/styling";

import OfflineNotice from "../../screens/OfflineNotice/OfflineNotice";

import Toast, { DURATION } from "react-native-easy-toast";

import DropdownAlert from "react-native-dropdownalert";

import {
  addFriend,
  getFriends,
  getFriendRequests,
  refreshFriendRequests,
  rejectFriend,
  friendsFromStorage
} from "../../store/actions/friends";

class GroupsScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  render() {
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

          {/* <SearchBar
            searchUsername={this.searchUsernameHandler}
            style={styles.searchBar}
          /> */}

          <View style={styles.friends}>
            <View style={styles.friendsHeaderWrapper}>
              <Text style={styles.friendsHeader}>Groups</Text>
            </View>
          </View>

          <DropdownAlert
            ref={ref => (this.dropdown = ref)}
            inactiveStatusBarStyle="light-content"
            inactiveStatusBarBackgroundColor={colors.blueColor}
            successColor={colors.greenColor}
            infoColor="#313131"
            successImageSrc={null}
            infoImageSrc={null}
            messageStyle={{
              fontSize: 17,
              textAlign: "center",
              fontWeight: "bold",
              color: "white",
              backgroundColor: "transparent"
            }}
            closeInterval={3500}
          />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    friends: state.friends.friends,
    friend_requests: state.friends.friend_requests,
    new_friend: state.friends.new_friend,
    show_response: state.friends.show_response,
    deleted_friend: state.friends.deleted_friend,
    deleted_response: state.friends.deleted_response,
    isLoadingFriends: state.ui.isLoadingFriends,
    isLoading: state.ui.isLoading
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
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
