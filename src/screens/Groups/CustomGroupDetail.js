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
  Dimensions,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";
import { addFriend } from "../../store/actions/friends";
import { addToGroup, rejectToGroup } from "../../store/actions/customGroups";
import DeleteButton from "../../components/UI/DeleteContactButton";
import colors from "../../utils/styling";
import ConnectedMembers from "../../components/GroupsList/ConnectedMembersList";

// import BlockedMembers from "../../components/CustomGroupsList/BlockedMembers";
// import AcceptedMembers from "../../components/CustomGroupsList/AcceptedMembers";
import RequestedMembers from "../../components/CustomGroupsList/RequestedMembers";
// import RequestedMembers from "wayvo/src/components/CustomGroupsList/RequestedMembers";

class CustomGroupDetail extends Component {
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
    buttonPosition: "connections"
  };

  adminPressed = () => {
    this.setState({
      buttonPosition: "admin"
    });
  };

  connectionsPressed = () => {
    this.setState({
      buttonPosition: "connections"
    });
  };

  activityPressed = () => {
    this.setState({
      buttonPosition: "activity"
    });
  };

  addMember = (id, username) => {
    this.props.onAddFriend(username);
    this.props.navigator.switchToTab({
      tabIndex: 1
    });
    this.props.navigator.pop();
  };

  onAddToGroup = id => {
    this.props.onAddToGroup(id);
  };

  onRejectToGroup = id => {
    Alert.alert(
      "Deny this member access to your group?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Deny Access",
          onPress: () => this.props.onRejectToGroup(id),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  render() {
    let header = null;
    let admin_button = null;
    let connected_peeps = null;
    let screen = null;
    if (
      this.props.customGroupConnections &&
      this.props.customGroupConnections.length > 0
    ) {
      header = (
        <View>
          <View style={styles.headerWrapper}>
            <Text style={styles.headerText}>
              Here are the members you've connected with from this group. You
              can add them to your Friends list to connect again.
            </Text>
          </View>
          <ConnectedMembers
            members={this.props.customGroupConnections}
            onItemSelected={this.addMember}
          />
        </View>
      );
    } else if (this.props.only_admin_in_group) {
      header = (
        <View style={styles.headerWrapperNoB}>
          <Text style={styles.headerText}>
            Looks like you haven't invited anyone into this group. Let others
            know they can join by adding your secret username:{" "}
            <Text style={styles.usernameText}>{this.props.secretUsername}</Text>
          </Text>
        </View>
      );
    } else {
      header = (
        <View style={styles.headerWrapperNoB}>
          <Text style={styles.headerText}>
            Once you connect with members from this group, you will see them on
            this screen. Go "Make a new friend" to start connecting with others
            from this group.
          </Text>
        </View>
      );
    }
    // screen content here ***********************************
    if (this.props.isLoadingGroups) {
      header = <ActivityIndicator color="#333" />;
    } else {
      switch (this.state.buttonPosition) {
        case "connections":
          screen = header;
          break;
        case "admin":
          screen = (
            <View>
              <Text style={styles.headerText}>
                Bring people together! Let others know they can join your group
                by adding your secret username:{" "}
                <Text style={styles.usernameText}>
                  {this.props.secretUsername}
                </Text>
              </Text>
              <RequestedMembers
                members={this.props.admin_data}
                onAddToGroup={this.onAddToGroup}
                onRejectToGroup={this.onRejectToGroup}
              />
            </View>
          );
          break;
        case "activity":
          screen = (
            <View>
              <Text>Coming soon...</Text>
            </View>
          );
          break;
      }

      if (this.props.is_admin) {
        admin_button = (
          <TouchableOpacity onPress={() => this.adminPressed()}>
            <Text
              style={[
                styles.topButtonText,
                this.state.buttonPosition == "admin"
                  ? { backgroundColor: colors.yellowColor }
                  : { backgroundColor: "#fff8db" }
              ]}
            >
              Members
            </Text>
          </TouchableOpacity>
        );
      }
    }
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.blueColor}
        />
        <View style={styles.topRow}>
          <View style={styles.addWrapper}>
            {admin_button}
            <TouchableOpacity onPress={() => this.connectionsPressed()}>
              <Text
                style={[
                  styles.topButtonText,
                  this.state.buttonPosition == "connections"
                    ? { backgroundColor: colors.yellowColor }
                    : { backgroundColor: "#fff8db" }
                ]}
              >
                Connections
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.activityPressed()}>
              <Text
                style={[
                  styles.topButtonText,
                  this.state.buttonPosition == "activity"
                    ? { backgroundColor: colors.yellowColor }
                    : { backgroundColor: "#fff8db" }
                ]}
              >
                Activity
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {screen}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    paddingBottom: 10
  },
  addWrapper: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-around",
    flexDirection: "row"
  },
  topButtonText: {
    //backgroundColor: colors.yellowColor,
    color: "#333",
    padding: 10,
    fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontWeight: "500"
  },
  firstName: {
    color: colors.blueColor,
    fontSize: 30,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 20
  },
  justMet: {
    color: "#333",
    fontSize: 25,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 20
  },
  lastName: {
    color: colors.pinkColor,
    fontSize: 30,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    textAlign: "center",
    fontWeight: "700"
  },
  individual: {
    paddingBottom: 280,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: colors.greenColor
  },
  addText: {
    backgroundColor: colors.greenColor,
    color: "#fff",
    padding: 10,
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 10
  },
  note: {
    fontSize: 16,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },

  ////
  container: {
    margin: 22,
    marginTop: 10,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  headerWrapper: {
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomColor: "#555",
    borderBottomWidth: 1,
    // width: "100%",
    fontWeight: "400"
  },
  headerWrapperNoB: {
    marginBottom: 20,
    paddingVertical: 10,
    width: "100%",
    fontWeight: "400"
  },
  headerText: {
    fontSize: 16,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    color: "#444"
  },
  usernameText: {
    color: colors.pinkColor
    // fontWeight: "900"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onAddFriend: username => dispatch(addFriend(username)),
    onAddToGroup: id => dispatch(addToGroup(id)),
    onRejectToGroup: id => dispatch(rejectToGroup(id))
  };
};

const mapStateToProps = state => {
  return {
    admin_data: state.custom_groups.admin_data,
    requested_members: state.custom_groups.requested_members,
    is_admin: state.custom_groups.is_admin,
    only_admin_in_group: state.custom_groups.only_admin_in_group,
    isLoadingGroups: state.ui.isLoadingGroups,
    customGroupConnections: state.custom_groups.connections_data
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomGroupDetail);
