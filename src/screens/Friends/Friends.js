import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Platform
} from "react-native";
import { connect } from "react-redux";

import FriendsList from "../../components/FriendsList/FriendsList";
import FriendRequests from "../../components/FriendsList/FriendRequests";

import SearchBar from "../../components/SearchBar/SearchBar";
import colors from "../../utils/styling";

import {
  addFriend,
  getFriends,
  getFriendRequests,
  refreshFriendRequests,
  rejectFriend
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
    this.props.onLoadFriendRequests();
  }

  friendSelectedHandler = id => {
    const selFriend = this.props.friends.find(friend => {
      return friend.id === id;
    });
    this.props.navigator.push({
      screen: "awesome-places.FriendSelectedScreen",
      //title: selFriend.fullname,
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
    navBarHidden: true
  };
  constructor(props) {
    super(props);
  }

  render() {
    let friends = null;
    if (this.props.isLoadingFriends) {
      friends = <ActivityIndicator />;
    } else {
      friends = (
        <FriendsList
          friends={this.props.friends}
          onItemSelected={this.friendSelectedHandler}
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
        <SearchBar
          searchUsername={this.searchUsernameHandler}
          style={styles.searchBar}
        />
        {friendRequests}
        <View style={styles.friends}>
          <View style={styles.friendsHeaderWrapper}>
            <Text style={styles.friendsHeader}>Contacts</Text>
          </View>
          {friends}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    friends: state.friends.friends,
    friend_requests: state.friends.friend_requests,
    isLoadingFriends: state.ui.isLoadingFriends,
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCheckUsername: username => dispatch(addFriend(username)),
    onLoadFriends: () => dispatch(getFriends()),
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
    padding: 10
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

// When someone adds you as a contact, they will not know if you accepted or rejected their request.
