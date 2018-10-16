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
    navBarHidden: false,
    statusBarColor: colors.blueColor,
    navBarBackgroundColor: colors.blueColor,
    navBarButtonColor: "#fff",
    navBarTextColor: "#fff"
  };
  constructor(props) {
    super(props);
  }

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
        <View>
          <DeleteButton onPress={this.friendDeletedHandler}>
            DELETE CONTACT
          </DeleteButton>
        </View>
        {/* <View>
          <Text>
            Protip: Contacts will not know if you delete them. If you are
            currently in their contact list, you will still remain in their
            contact list once you delete them.
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
    onDeleteFriend: (id, fullname) => dispatch(deleteFriend(id, fullname))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(FriendDetail);
