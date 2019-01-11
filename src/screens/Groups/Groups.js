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

// import ImagePicker from "react-native-image-picker";
// import ImagePickerAndroidWrapper from "../../utils/ImagePickerAndroid";

import ImagePicker from "../../utils/ImagePickerAndroid";

class GroupsScreen extends Component {
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

  pickImageHandler = () => {
    if (Platform.OS === "ios") {
      // ios
      ImagePicker.showImagePicker(
        { title: "Upload picture of your student ID" },
        res => {
          if (res.didCancel) {
            console.log("User cancelled!");
          } else if (res.error) {
            console.log("Error", res.error);
          } else {
            this.setState({
              pickedImaged: { uri: res.uri },
              rotatePosition: 0
            });
            console.log(res.data);
            //this.props.onImagePicked({uri: res.uri, base64: res.data});
          }
        }
      );
    } else {
      // android
      ImagePicker.launchCamera(
        { title: "Upload picture of your student ID" },
        res => {
          if (res.didCancel) {
            console.log("User cancelled!");
          } else if (res.error) {
            console.log("Error", res.error);
          } else {
            this.setState({
              pickedImaged: { uri: res.uri },
              rotatePosition: 0
            });
            console.log(res.data);
            //this.props.onImagePicked({uri: res.uri, base64: res.data});
          }
        }
      );
    }
  };

  rotateImage = () => {
    if (this.state.rotatePosition === 3) {
      this.setState({
        rotatePosition: 0
      });
    } else {
      this.setState({
        rotatePosition: this.state.rotatePosition + 1
      });
    }
  };

  getRotation(index) {
    if (index === 1) {
      return {
        transform: [{ rotate: "90deg" }]
      };
    } else if (index === 2) {
      return {
        transform: [{ rotate: "180deg" }]
      };
    } else if (index === 3) {
      return {
        transform: [{ rotate: "270deg" }]
      };
    } else if (index === 4) {
      return {
        transform: [{ rotate: "0deg" }]
      };
    }
  }

  render() {
    let pictureButtonTitle = "Take Picture";
    if (this.state.pickedImaged) {
      pictureButtonTitle = "Retake Picture";
    }
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

          <View style={styles.placeholder}>
            <Image
              source={this.state.pickedImaged}
              style={[
                styles.previewImage,
                this.getRotation(this.state.rotatePosition)
              ]}
            />
          </View>
          <View style={styles.button}>
            <Button
              title={pictureButtonTitle}
              onPress={this.pickImageHandler}
            />
          </View>
          <View style={styles.button}>
            <Button title="Rotate" onPress={this.rotateImage} />
          </View>
          <View style={styles.button}>
            <Button title="Upload" onPress={this.rotateImage} />
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
)(GroupsScreen);

// When someone adds you as a friend, they will not know if you accepted or rejected their request.
