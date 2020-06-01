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

class FriendsScreen extends Component {
  // constructor(props) {
  //   super(props);
  //   this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  // }

  // onNavigatorEvent = event => {
  //   if (event.type === "ScreenChangedEvent") {
  //     if (event.id === "willAppear") {
  //       this.props.onLoadFriendRequests();
  //     }
  //   }
  // };

  componentDidMount() {
    this.props.onLoadFriends();
    //this.props.friendsFromStorage();
    this.props.onLoadFriendRequests();
  }

  friendSelectedHandler = id => {
    const selFriend = this.props.friends.find(friend => {
      return friend.id === id;
    });
    this.props.navigator.push({
      screen: "awesome-places.FriendSelectedScreen",
      backButtonTitle: "",
      passProps: {
        selectedFriend: selFriend
      }
    });
  };

  searchUsernameHandler = username => {
    this.props.onCheckUsername(username);
  };

  friendAccepted = username => {
    this.props.onCheckUsername(username);
    this.props.onRefreshRequests(username);
  };

  friendRejected = obj => {
    this.props.onRejectFriend(obj.id);
    this.props.onRefreshRequests(obj.username);
  };

  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  state = {
    friend_added: null
  };

  render() {
    let friends = null;
    if (this.props.isLoadingFriends) {
      friends = <ActivityIndicator size="small" color="#fff" marginTop={10} />;
    } else {
      friends = (
        <FriendsList
          friends={this.props.friends} //sending to friendslist component 
          onItemSelected={this.friendSelectedHandler} //receiving from friendslist component 
        />
      );
    }

    let friendRequests = null;
    if (!this.props.friend_requests.length === false) {
      // array does not exist, is not an array, or is empty
      friendRequests = (
        <View style={styles.friendRequests}>
          <View style={styles.friendsHeaderWrapper}>
            <Text style={[styles.friendsHeader, styles.requestsHeader]}>
              Requests
            </Text>
          </View>
          <FriendRequests
            requests={this.props.friend_requests}
            onAddFriendDecision={this.friendAccepted}
            onRejectFriendDecision={this.friendRejected}
          />
        </View>
      );
    }

    if (this.props.new_friend && this.props.show_response) {
      this.dropdown.alertWithType(
        "success",
        "",
        `${this.props.new_friend} is now a friend`
      );
    }

    if (this.props.deleted_friend && this.props.deleted_response) {
      this.dropdown.alertWithType(
        "info",
        "",
        `${this.props.deleted_friend} has been deleted from your friends list`
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isLoading}
            onRefresh={() => this.props.onLoadFriendRequests()}
          />
        }
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.blueColor }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.blueColor}
          />
          {/* <OfflineNotice /> */}
          <SearchBar
            searchUsername={this.searchUsernameHandler}
            style={styles.searchBar}
          />
          {friendRequests}
          <View style={styles.friends}>
            <View style={styles.friendsHeaderWrapper}>
              <Text style={styles.friendsHeader}>Friends</Text>
            </View>
            {friends}
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
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
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
)(FriendsScreen);

// When someone adds you as a friend, they will not know if you accepted or rejected their request.
