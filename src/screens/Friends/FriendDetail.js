import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Switch,
  Alert,
  Dimensions
} from "react-native";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";
import {
  deleteFriend,
  sendNotification,
  receiveNotification
} from "../../store/actions/friends";
import DeleteButton from "../../components/UI/DeleteContactButton";
import colors from "../../utils/styling";

class FriendDetail extends Component {
  static navigatorStyle = {
    navBarHidden: false,
    statusBarColor: colors.blueColor,
    navBarBackgroundColor: colors.blueColor,
    navBarButtonColor: "#fff",
    navBarTextColor: "#fff"
  };
  constructor(props) {
    super(props);
  }

  state = {
    send_initial: this.props.selectedFriend.send_notifications,
    receive_initial: this.props.selectedFriend.receive_notifications,
    send_notifications: this.props.selectedFriend.send_notifications,
    receive_notifications: this.props.selectedFriend.receive_notifications
  };

  sendChange = () => {
    this.setState(prevState => ({
      send_notifications: !prevState.send_notifications
    }));
  };

  receiveChange = () => {
    this.setState(prevState => ({
      receive_notifications: !prevState.receive_notifications
    }));
  };

  componentWillUnmount() {
    if (this.state.send_initial !== this.state.send_notifications) {
      this.props.onSendNotification(
        this.props.selectedFriend.id,
        this.state.send_notifications
      );
    }
    if (this.state.receive_initial !== this.state.receive_notifications) {
      this.props.onReceiveNotification(
        this.props.selectedFriend.id,
        this.state.receive_notifications
      );
    }
  }

  logoutPrompt = () => {
    Alert.alert(
      "Are you sure you want to delete this friend?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => this.friendDeletedHandler(),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  friendDeletedHandler = () => {
    this.props.onDeleteFriend(
      this.props.selectedFriend.id,
      this.props.selectedFriend.fullname
    );
    this.props.navigator.pop();
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.blueColor}
        />
        <View>
          <Text style={styles.name}>{this.props.selectedFriend.fullname}</Text>
          <Text style={styles.username}>
            {this.props.selectedFriend.username}
          </Text>
        </View>

        <View style={[styles.toggleWrapper, styles.borderOverride]}>
          {/* toggle options here  */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleText}>
              Let this friend know when I Say Hello
            </Text>
          </View>
          <Switch
            style={styles.switch}
            value={this.state.send_notifications}
            onValueChange={this.sendChange}
          />
        </View>
        <View style={styles.toggleWrapper}>
          {/* toggle options here  */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleText}>
              Let me know when this friend Says Hello
            </Text>
          </View>
          <Switch
            style={styles.switch}
            value={this.state.receive_notifications}
            onValueChange={this.receiveChange}
            trackColor={colors.blueColor}
          />
        </View>

        <View style={styles.deleteContainer}>
          <DeleteButton onPress={this.logoutPrompt}>DELETE FRIEND</DeleteButton>
        </View>

        {/* <View>
          <Text>
            Protip: Friends will not know if you delete them. If you are
            currently in their friend list, you will still remain in their
            friend list once you delete them.
          </Text>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 22,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  name: {
    fontWeight: "bold",
    fontSize: 25,
    color: colors.blueColor,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  username: {
    fontWeight: "bold",
    fontSize: 25,
    color: colors.pinkColor,
    textAlign: "center",
    marginBottom: 25,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  deleteButton: {
    alignItems: "center"
  },
  deleteContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1
  },
  borderOverride: {
    borderTopWidth: 1,
    borderTopColor: "#777"
  },
  toggleWrapper: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#777"
  },
  toggleSection: {
    width: "60%"
  },
  toggleText: {
    fontSize: Dimensions.get("window").width > 330 ? 18 : 17,
    color: "#333",
    paddingLeft: 8,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  switch: {
    marginRight: 8
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onDeleteFriend: (id, fullname) => dispatch(deleteFriend(id, fullname)),
    onSendNotification: (id, option) => dispatch(sendNotification(id, option)),
    onReceiveNotification: (id, option) =>
      dispatch(receiveNotification(id, option))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(FriendDetail);
