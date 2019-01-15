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
import DropdownAlert from "react-native-dropdownalert";

import ImagePicker from "../../utils/ImagePickerAndroid";
import { RNS3 } from "react-native-aws3";
import { changeGroupState } from "../../store/actions/groups";

class GroupSelectUniversity extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  state = {
    pickedImaged: null,
    rotatePosition: 0
  };

  render() {
    return (
      <View>
        <Text>select university</Text>
        <Button title="sup" onPress={() => this.props.onChangeGroupState(3)} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.users.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeGroupState: position => dispatch(changeGroupState(position))
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
)(GroupSelectUniversity);

// When someone adds you as a friend, they will not know if you accepted or rejected their request.
