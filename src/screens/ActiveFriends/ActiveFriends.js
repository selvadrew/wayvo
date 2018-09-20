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
import CallStatus from "../../components/ActiveFriends/CallStatus";
import { getActiveFriends } from "../../store/actions/activeFriends";
import colors from "../../utils/styling";

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
    drawUnderNavBar: true,
    navBarTranslucent: true,
    navBarBackgroundColor: colors.yellowColor,
    navBarButtonColor: "#ffffff",
    navBarHidden: true,
    topBarElevationShadowEnabled: true
  };

  render() {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isLoadingActivity}
            onRefresh={() => this.props.onLoadActiveFriends()}
          />
        }
      >
        <View style={styles.friends}>
          <View style={styles.friendsHeaderWrapper}>
            <Text style={styles.friendsHeader}>Active Contacts 🔥🙌🔥</Text>
          </View>
          <CallStatus
            friends={this.props.active_friends}
            onItemSelected={this.onClickFriend}
            style={styles.friends}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    active_friends: state.active_friends.active_friends,
    isLoadingActivity: state.ui.isLoadingActivity
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
    margin: 15,
    marginTop: Platform.OS === "ios" ? 30 : 20,
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveFriendsScreen);
