import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar
} from "react-native";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";
import { deleteFriend } from "../../store/actions/friends";
import DeleteButton from "../../components/UI/DeleteContactButton";
import colors from "../../utils/styling";

class FriendDetail extends Component {
  static navigatorStyle = {
    navBarHidden: false
  };
  constructor(props) {
    super(props);
  }

  friendDeletedHandler = () => {
    this.props.onDeleteFriend(this.props.selectedFriend.id);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View>
          <Text style={styles.name}>{this.props.selectedFriend.fullname}</Text>
          <Text style={styles.username}>
            {this.props.selectedFriend.username}
          </Text>
        </View>
        <View>
          <DeleteButton onPress={this.friendDeletedHandler}>
            DELETE CONTACT
          </DeleteButton>
        </View>
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
    textAlign: "center"
  },
  username: {
    fontWeight: "bold",
    fontSize: 25,
    color: colors.pinkColor,
    textAlign: "center"
  },
  deleteButton: {
    alignItems: "center"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onDeleteFriend: key => dispatch(deleteFriend(key))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(FriendDetail);
