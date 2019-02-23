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
import DeleteButton from "../../components/UI/DeleteContactButton";
import colors from "../../utils/styling";

import ConnectedMembers from "../../components/GroupsList/ConnectedMembersList";
import DropdownAlert from "react-native-dropdownalert";

class GroupDetail extends Component {
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
    // send_initial: this.props.selectedFriend.send_notifications
  };

  // This list

  // When you connect with members from this group, you'll see them here.
  // You can add them to your friends list to connect again.

  addMember = (id, username) => {
    this.props.onAddFriend(username);
    this.props.navigator.switchToTab({
      tabIndex: 1
    });
    this.props.navigator.pop();
  };

  render() {
    let header = null;
    if (this.props.isLoadingGroups) {
      header = <ActivityIndicator color="#333" />;
    } else {
      if (
        this.props.groupConnections &&
        this.props.groupConnections.length > 0
      ) {
        header = (
          <View style={styles.headerWrapper}>
            <Text style={styles.headerText}>
              Here are the members you've connected with from this group. You
              can add them to your Friends list to connect again.
            </Text>
          </View>
        );
      } else {
        header = (
          <View style={styles.headerWrapperNoB}>
            <Text style={styles.headerText}>
              Once you connect with members from this group, you will see them
              on this screen. Go "Make a new friend" to start connecting with
              others from this group.
            </Text>
          </View>
        );
      }
    }
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.blueColor}
        />
        {header}
        <ConnectedMembers
          members={this.props.groupConnections}
          onItemSelected={this.addMember}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 22,
    marginTop: 10,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  headerWrapper: {
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomColor: "#555",
    borderBottomWidth: 1,
    width: "100%",
    fontWeight: "400"
  },
  headerWrapperNoB: {
    marginBottom: 20,
    paddingVertical: 10,
    width: "100%",
    fontWeight: "400"
  },
  headerText: {
    fontSize: 20,
    color: "#444"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onAddFriend: username => dispatch(addFriend(username))
  };
};

const mapStateToProps = state => {
  return {
    groupConnections: state.groups.groupConnections,
    isLoadingGroups: state.ui.isLoadingGroups
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupDetail);
